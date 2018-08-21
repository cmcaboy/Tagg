/*
 * Copyright 2018 Google
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

#ifndef FIRESTORE_CORE_INCLUDE_FIREBASE_FIRESTORE_FIELD_VALUE_H_
#define FIRESTORE_CORE_INCLUDE_FIREBASE_FIRESTORE_FIELD_VALUE_H_

namespace firebase {
namespace firestore {

class FieldValueInternal;

/**
 * Sentinel values that can be used when writing document fields with setData()
 * or updateData().
 */
// TODO(zxu123): add more methods to complete the class and make it useful.
class FieldValue {
 private:
  friend class QueryInternal;

  FieldValueInternal* internal_ = nullptr;
};

}  // namespace firestore
}  // namespace firebase

#endif  // FIRESTORE_CORE_INCLUDE_FIREBASE_FIRESTORE_FIELD_VALUE_H_
