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

#import "Firestore/Source/Local/FSTQueryData.h"

#include <utility>

#import "Firestore/Source/Core/FSTQuery.h"

#include "Firestore/core/src/firebase/firestore/model/snapshot_version.h"

using firebase::firestore::model::SnapshotVersion;

NS_ASSUME_NONNULL_BEGIN

@implementation FSTQueryData {
  SnapshotVersion _snapshotVersion;
}

- (instancetype)initWithQuery:(FSTQuery *)query
                     targetID:(FSTTargetID)targetID
         listenSequenceNumber:(FSTListenSequenceNumber)sequenceNumber
                      purpose:(FSTQueryPurpose)purpose
              snapshotVersion:(SnapshotVersion)snapshotVersion
                  resumeToken:(NSData *)resumeToken {
  self = [super init];
  if (self) {
    _query = query;
    _targetID = targetID;
    _sequenceNumber = sequenceNumber;
    _purpose = purpose;
    _snapshotVersion = std::move(snapshotVersion);
    _resumeToken = [resumeToken copy];
  }
  return self;
}

- (instancetype)initWithQuery:(FSTQuery *)query
                     targetID:(FSTTargetID)targetID
         listenSequenceNumber:(FSTListenSequenceNumber)sequenceNumber
                      purpose:(FSTQueryPurpose)purpose {
  return [self initWithQuery:query
                    targetID:targetID
        listenSequenceNumber:sequenceNumber
                     purpose:purpose
             snapshotVersion:SnapshotVersion::None()
                 resumeToken:[NSData data]];
}

- (const firebase::firestore::model::SnapshotVersion &)snapshotVersion {
  return _snapshotVersion;
}

- (BOOL)isEqual:(id)object {
  if (self == object) {
    return YES;
  }
  if (![object isKindOfClass:[FSTQueryData class]]) {
    return NO;
  }

  FSTQueryData *other = (FSTQueryData *)object;
  return [self.query isEqual:other.query] && self.targetID == other.targetID &&
         self.purpose == other.purpose && self.snapshotVersion == other.snapshotVersion &&
         [self.resumeToken isEqual:other.resumeToken];
}

- (NSUInteger)hash {
  NSUInteger result = [self.query hash];
  result = result * 31 + self.targetID;
  result = result * 31 + self.purpose;
  result = result * 31 + self.snapshotVersion.Hash();
  result = result * 31 + [self.resumeToken hash];
  return result;
}

- (NSString *)description {
  return [NSString
      stringWithFormat:@"<FSTQueryData: query:%@ target:%d purpose:%lu version:%s resumeToken:%@)>",
                       self.query, self.targetID, (unsigned long)self.purpose,
                       self.snapshotVersion.timestamp().ToString().c_str(), self.resumeToken];
}

- (instancetype)queryDataByReplacingSnapshotVersion:(SnapshotVersion)snapshotVersion
                                        resumeToken:(NSData *)resumeToken
                                     sequenceNumber:(FSTListenSequenceNumber)sequenceNumber {
  return [[FSTQueryData alloc] initWithQuery:self.query
                                    targetID:self.targetID
                        listenSequenceNumber:sequenceNumber
                                     purpose:self.purpose
                             snapshotVersion:std::move(snapshotVersion)
                                 resumeToken:resumeToken];
}

@end

NS_ASSUME_NONNULL_END
