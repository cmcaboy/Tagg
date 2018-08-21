/*
 * Copyright 2017 Google
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#import "Firestore/Source/Local/FSTLevelDBQueryCache.h"

#include <memory>
#include <string>
#include <utility>

#import "Firestore/Protos/objc/firestore/local/Target.pbobjc.h"
#import "Firestore/Source/Core/FSTQuery.h"
#import "Firestore/Source/Local/FSTLevelDB.h"
#import "Firestore/Source/Local/FSTLevelDBKey.h"
#import "Firestore/Source/Local/FSTLocalSerializer.h"
#import "Firestore/Source/Local/FSTQueryData.h"

#include "Firestore/core/src/firebase/firestore/local/leveldb_key.h"
#include "Firestore/core/src/firebase/firestore/model/document_key.h"
#include "Firestore/core/src/firebase/firestore/model/snapshot_version.h"
#include "Firestore/core/src/firebase/firestore/util/hard_assert.h"
#include "Firestore/core/src/firebase/firestore/util/ordered_code.h"
#include "absl/strings/match.h"

NS_ASSUME_NONNULL_BEGIN

using Firestore::StringView;
using firebase::firestore::local::DescribeKey;
using firebase::firestore::local::LevelDbTransaction;
using firebase::firestore::model::DocumentKey;
using firebase::firestore::model::DocumentKeySet;
using firebase::firestore::model::SnapshotVersion;
using firebase::firestore::util::OrderedCode;
using leveldb::DB;
using leveldb::Slice;
using leveldb::Status;

namespace {

FSTListenSequenceNumber ReadSequenceNumber(const absl::string_view &slice) {
  FSTListenSequenceNumber decoded;
  absl::string_view tmp(slice.data(), slice.size());
  if (!OrderedCode::ReadSignedNumIncreasing(&tmp, &decoded)) {
    HARD_FAIL("Failed to read sequence number from a sentinel row");
  }
  return decoded;
}
}  // namespace

@interface FSTLevelDBQueryCache ()

/** A write-through cached copy of the metadata for the query cache. */
@property(nonatomic, strong, nullable) FSTPBTargetGlobal *metadata;

@property(nonatomic, strong, readonly) FSTLocalSerializer *serializer;

@end

@implementation FSTLevelDBQueryCache {
  FSTLevelDB *_db;

  /**
   * The last received snapshot version. This is part of `metadata` but we store it separately to
   * avoid extra conversion to/from GPBTimestamp.
   */
  SnapshotVersion _lastRemoteSnapshotVersion;
}

+ (nullable FSTPBTargetGlobal *)readTargetMetadataWithTransaction:
    (firebase::firestore::local::LevelDbTransaction *)transaction {
  std::string key = [FSTLevelDBTargetGlobalKey key];
  std::string value;
  Status status = transaction->Get(key, &value);
  if (status.IsNotFound()) {
    return nil;
  } else if (!status.ok()) {
    HARD_FAIL("metadataForKey: failed loading key %s with status: %s", key, status.ToString());
  }

  NSData *data =
      [[NSData alloc] initWithBytesNoCopy:(void *)value.data() length:value.size() freeWhenDone:NO];

  NSError *error;
  FSTPBTargetGlobal *proto = [FSTPBTargetGlobal parseFromData:data error:&error];
  if (!proto) {
    HARD_FAIL("FSTPBTargetGlobal failed to parse: %s", error);
  }

  return proto;
}

+ (nullable FSTPBTargetGlobal *)readTargetMetadataFromDB:(DB *)db {
  std::string key = [FSTLevelDBTargetGlobalKey key];
  std::string value;
  Status status = db->Get([FSTLevelDB standardReadOptions], key, &value);
  if (status.IsNotFound()) {
    return nil;
  } else if (!status.ok()) {
    HARD_FAIL("metadataForKey: failed loading key %s with status: %s", key, status.ToString());
  }

  NSData *data =
      [[NSData alloc] initWithBytesNoCopy:(void *)value.data() length:value.size() freeWhenDone:NO];

  NSError *error;
  FSTPBTargetGlobal *proto = [FSTPBTargetGlobal parseFromData:data error:&error];
  if (!proto) {
    HARD_FAIL("FSTPBTargetGlobal failed to parse: %s", error);
  }

  return proto;
}

- (instancetype)initWithDB:(FSTLevelDB *)db serializer:(FSTLocalSerializer *)serializer {
  if (self = [super init]) {
    HARD_ASSERT(db, "db must not be NULL");
    _db = db;
    _serializer = serializer;
  }
  return self;
}

- (void)start {
  // TODO(gsoltis): switch this usage of ptr to currentTransaction
  FSTPBTargetGlobal *metadata = [FSTLevelDBQueryCache readTargetMetadataFromDB:_db.ptr];
  HARD_ASSERT(
      metadata != nil,
      "Found nil metadata, expected schema to be at version 0 which ensures metadata existence");
  _lastRemoteSnapshotVersion = [self.serializer decodedVersion:metadata.lastRemoteSnapshotVersion];

  self.metadata = metadata;
}

#pragma mark - FSTQueryCache implementation

- (FSTTargetID)highestTargetID {
  return self.metadata.highestTargetId;
}

- (FSTListenSequenceNumber)highestListenSequenceNumber {
  return self.metadata.highestListenSequenceNumber;
}

- (const SnapshotVersion &)lastRemoteSnapshotVersion {
  return _lastRemoteSnapshotVersion;
}

- (void)setLastRemoteSnapshotVersion:(SnapshotVersion)snapshotVersion {
  _lastRemoteSnapshotVersion = std::move(snapshotVersion);
  self.metadata.lastRemoteSnapshotVersion =
      [self.serializer encodedVersion:_lastRemoteSnapshotVersion];
  _db.currentTransaction->Put([FSTLevelDBTargetGlobalKey key], self.metadata);
}

- (void)enumerateTargetsUsingBlock:(void (^)(FSTQueryData *queryData, BOOL *stop))block {
  // Enumerate all targets, give their sequence numbers.
  std::string targetPrefix = [FSTLevelDBTargetKey keyPrefix];
  auto it = _db.currentTransaction->NewIterator();
  it->Seek(targetPrefix);
  BOOL stop = NO;
  for (; !stop && it->Valid() && absl::StartsWith(it->key(), targetPrefix); it->Next()) {
    FSTQueryData *target = [self decodedTarget:it->value()];
    block(target, &stop);
  }
}

- (void)enumerateOrphanedDocumentsUsingBlock:
    (void (^)(const DocumentKey &docKey, FSTListenSequenceNumber sequenceNumber, BOOL *stop))block {
  std::string documentTargetPrefix = [FSTLevelDBDocumentTargetKey keyPrefix];
  auto it = _db.currentTransaction->NewIterator();
  it->Seek(documentTargetPrefix);
  FSTListenSequenceNumber nextToReport = 0;
  DocumentKey keyToReport;
  FSTLevelDBDocumentTargetKey *key = [[FSTLevelDBDocumentTargetKey alloc] init];
  BOOL stop = NO;
  for (; !stop && it->Valid() && absl::StartsWith(it->key(), documentTargetPrefix); it->Next()) {
    [key decodeKey:it->key()];
    if (FSTTargetIDIsSentinel(key.targetID)) {
      // if nextToReport is non-zero, report it, this is a new key so the last one
      // must be not be a member of any targets.
      if (nextToReport != 0) {
        block(keyToReport, nextToReport, &stop);
      }
      // set nextToReport to be this sequence number. It's the next one we might
      // report, if we don't find any targets for this document.
      nextToReport = ReadSequenceNumber(it->value());
      keyToReport = key.documentKey;
    } else {
      // set nextToReport to be 0, we know we don't need to report this one since
      // we found a target for it.
      nextToReport = 0;
    }
  }
  // if not stop and nextToReport is non-zero, report it. We didn't find any targets for
  // that document, and we weren't asked to stop.
  if (!stop && nextToReport != 0) {
    block(keyToReport, nextToReport, &stop);
  }
}

- (void)saveQueryData:(FSTQueryData *)queryData {
  FSTTargetID targetID = queryData.targetID;
  std::string key = [FSTLevelDBTargetKey keyWithTargetID:targetID];
  _db.currentTransaction->Put(key, [self.serializer encodedQueryData:queryData]);
}

- (BOOL)updateMetadataForQueryData:(FSTQueryData *)queryData {
  BOOL updatedMetadata = NO;

  if (queryData.targetID > self.metadata.highestTargetId) {
    self.metadata.highestTargetId = queryData.targetID;
    updatedMetadata = YES;
  }

  if (queryData.sequenceNumber > self.metadata.highestListenSequenceNumber) {
    self.metadata.highestListenSequenceNumber = queryData.sequenceNumber;
    updatedMetadata = YES;
  }
  return updatedMetadata;
}

- (void)addQueryData:(FSTQueryData *)queryData {
  [self saveQueryData:queryData];

  NSString *canonicalID = queryData.query.canonicalID;
  std::string indexKey =
      [FSTLevelDBQueryTargetKey keyWithCanonicalID:canonicalID targetID:queryData.targetID];
  std::string emptyBuffer;
  _db.currentTransaction->Put(indexKey, emptyBuffer);

  self.metadata.targetCount += 1;
  [self updateMetadataForQueryData:queryData];
  _db.currentTransaction->Put([FSTLevelDBTargetGlobalKey key], self.metadata);
}

- (void)updateQueryData:(FSTQueryData *)queryData {
  [self saveQueryData:queryData];

  if ([self updateMetadataForQueryData:queryData]) {
    _db.currentTransaction->Put([FSTLevelDBTargetGlobalKey key], self.metadata);
  }
}

- (void)removeQueryData:(FSTQueryData *)queryData {
  FSTTargetID targetID = queryData.targetID;

  [self removeMatchingKeysForTargetID:targetID];

  std::string key = [FSTLevelDBTargetKey keyWithTargetID:targetID];
  _db.currentTransaction->Delete(key);

  std::string indexKey =
      [FSTLevelDBQueryTargetKey keyWithCanonicalID:queryData.query.canonicalID targetID:targetID];
  _db.currentTransaction->Delete(indexKey);
  self.metadata.targetCount -= 1;
  _db.currentTransaction->Put([FSTLevelDBTargetGlobalKey key], self.metadata);
}

- (int)removeQueriesThroughSequenceNumber:(FSTListenSequenceNumber)sequenceNumber
                              liveQueries:(NSDictionary<NSNumber *, FSTQueryData *> *)liveQueries {
  int count = 0;
  std::string targetPrefix = [FSTLevelDBTargetKey keyPrefix];
  auto it = _db.currentTransaction->NewIterator();
  it->Seek(targetPrefix);
  for (; it->Valid() && absl::StartsWith(it->key(), targetPrefix); it->Next()) {
    FSTQueryData *queryData = [self decodedTarget:it->value()];
    if (queryData.sequenceNumber <= sequenceNumber && !liveQueries[@(queryData.targetID)]) {
      [self removeQueryData:queryData];
      count++;
    }
  }
  return count;
}

- (int32_t)count {
  return self.metadata.targetCount;
}

/**
 * Parses the given bytes as an FSTPBTarget protocol buffer and then converts to the equivalent
 * query data.
 */
- (FSTQueryData *)decodedTarget:(absl::string_view)encoded {
  NSData *data = [[NSData alloc] initWithBytesNoCopy:(void *)encoded.data()
                                              length:encoded.size()
                                        freeWhenDone:NO];

  NSError *error;
  FSTPBTarget *proto = [FSTPBTarget parseFromData:data error:&error];
  if (!proto) {
    HARD_FAIL("FSTPBTarget failed to parse: %s", error);
  }

  return [self.serializer decodedQueryData:proto];
}

- (nullable FSTQueryData *)queryDataForQuery:(FSTQuery *)query {
  // Scan the query-target index starting with a prefix starting with the given query's canonicalID.
  // Note that this is a scan rather than a get because canonicalIDs are not required to be unique
  // per target.
  Slice canonicalID = StringView(query.canonicalID);
  auto indexItererator = _db.currentTransaction->NewIterator();
  std::string indexPrefix = [FSTLevelDBQueryTargetKey keyPrefixWithCanonicalID:canonicalID];
  indexItererator->Seek(indexPrefix);

  // Simultaneously scan the targets table. This works because each (canonicalID, targetID) pair is
  // unique and ordered, so when scanning a table prefixed by exactly one canonicalID, all the
  // targetIDs will be unique and in order.
  std::string targetPrefix = [FSTLevelDBTargetKey keyPrefix];
  auto targetIterator = _db.currentTransaction->NewIterator();

  FSTLevelDBQueryTargetKey *rowKey = [[FSTLevelDBQueryTargetKey alloc] init];
  for (; indexItererator->Valid(); indexItererator->Next()) {
    // Only consider rows matching exactly the specific canonicalID of interest.
    if (!absl::StartsWith(indexItererator->key(), indexPrefix) ||
        ![rowKey decodeKey:indexItererator->key()] || canonicalID != rowKey.canonicalID) {
      // End of this canonicalID's possible targets.
      break;
    }

    // Each row is a unique combination of canonicalID and targetID, so this foreign key reference
    // can only occur once.
    std::string targetKey = [FSTLevelDBTargetKey keyWithTargetID:rowKey.targetID];
    targetIterator->Seek(targetKey);
    if (!targetIterator->Valid() || targetIterator->key() != targetKey) {
      HARD_FAIL(
          "Dangling query-target reference found: "
          "%s points to %s; seeking there found %s",
          DescribeKey(indexItererator), DescribeKey(targetKey), DescribeKey(targetIterator));
    }

    // Finally after finding a potential match, check that the query is actually equal to the
    // requested query.
    FSTQueryData *target = [self decodedTarget:targetIterator->value()];
    if ([target.query isEqual:query]) {
      return target;
    }
  }

  return nil;
}

#pragma mark Matching Key tracking

- (void)addMatchingKeys:(const DocumentKeySet &)keys forTargetID:(FSTTargetID)targetID {
  // Store an empty value in the index which is equivalent to serializing a GPBEmpty message. In the
  // future if we wanted to store some other kind of value here, we can parse these empty values as
  // with some other protocol buffer (and the parser will see all default values).
  std::string emptyBuffer;

  for (const DocumentKey &key : keys) {
    self->_db.currentTransaction->Put(
        [FSTLevelDBTargetDocumentKey keyWithTargetID:targetID documentKey:key], emptyBuffer);
    self->_db.currentTransaction->Put(
        [FSTLevelDBDocumentTargetKey keyWithDocumentKey:key targetID:targetID], emptyBuffer);
    [self->_db.referenceDelegate addReference:key];
  };
}

- (void)removeMatchingKeys:(const DocumentKeySet &)keys forTargetID:(FSTTargetID)targetID {
  for (const DocumentKey &key : keys) {
    self->_db.currentTransaction->Delete(
        [FSTLevelDBTargetDocumentKey keyWithTargetID:targetID documentKey:key]);
    self->_db.currentTransaction->Delete(
        [FSTLevelDBDocumentTargetKey keyWithDocumentKey:key targetID:targetID]);
    [self->_db.referenceDelegate removeReference:key];
  }
}

- (void)removeMatchingKeysForTargetID:(FSTTargetID)targetID {
  std::string indexPrefix = [FSTLevelDBTargetDocumentKey keyPrefixWithTargetID:targetID];
  auto indexIterator = _db.currentTransaction->NewIterator();
  indexIterator->Seek(indexPrefix);

  FSTLevelDBTargetDocumentKey *rowKey = [[FSTLevelDBTargetDocumentKey alloc] init];
  for (; indexIterator->Valid(); indexIterator->Next()) {
    absl::string_view indexKey = indexIterator->key();

    // Only consider rows matching this specific targetID.
    if (![rowKey decodeKey:indexKey] || rowKey.targetID != targetID) {
      break;
    }
    const DocumentKey &documentKey = rowKey.documentKey;

    // Delete both index rows
    _db.currentTransaction->Delete(indexKey);
    _db.currentTransaction->Delete(
        [FSTLevelDBDocumentTargetKey keyWithDocumentKey:documentKey targetID:targetID]);
  }
}

- (DocumentKeySet)matchingKeysForTargetID:(FSTTargetID)targetID {
  std::string indexPrefix = [FSTLevelDBTargetDocumentKey keyPrefixWithTargetID:targetID];
  auto indexIterator = _db.currentTransaction->NewIterator();
  indexIterator->Seek(indexPrefix);

  DocumentKeySet result;
  FSTLevelDBTargetDocumentKey *rowKey = [[FSTLevelDBTargetDocumentKey alloc] init];
  for (; indexIterator->Valid(); indexIterator->Next()) {
    absl::string_view indexKey = indexIterator->key();

    // Only consider rows matching this specific targetID.
    if (![rowKey decodeKey:indexKey] || rowKey.targetID != targetID) {
      break;
    }

    result = result.insert(rowKey.documentKey);
  }

  return result;
}

- (BOOL)containsKey:(const DocumentKey &)key {
  // ignore sentinel rows when determining if a key belongs to a target. Sentinel row just says the
  // document exists, not that it's a member of any particular target.
  std::string indexPrefix = [FSTLevelDBDocumentTargetKey keyPrefixWithResourcePath:key.path()];
  auto indexIterator = _db.currentTransaction->NewIterator();
  indexIterator->Seek(indexPrefix);

  for (; indexIterator->Valid() && absl::StartsWith(indexIterator->key(), indexPrefix);
       indexIterator->Next()) {
    FSTLevelDBDocumentTargetKey *rowKey = [[FSTLevelDBDocumentTargetKey alloc] init];
    if ([rowKey decodeKey:indexIterator->key()] && !FSTTargetIDIsSentinel(rowKey.targetID) &&
        DocumentKey{rowKey.documentKey} == key) {
      return YES;
    }
  }

  return NO;
}

@end

NS_ASSUME_NONNULL_END
