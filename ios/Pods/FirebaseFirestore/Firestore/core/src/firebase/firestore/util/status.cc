/*
 * Copyright 2015, 2018 Google
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

#include "Firestore/core/src/firebase/firestore/util/status.h"

#include <cerrno>

#include "Firestore/core/src/firebase/firestore/util/strerror.h"
#include "Firestore/core/src/firebase/firestore/util/string_format.h"

namespace firebase {
namespace firestore {
namespace util {

Status::Status(FirestoreErrorCode code, absl::string_view msg) {
  HARD_ASSERT(code != FirestoreErrorCode::Ok);
  state_ = std::unique_ptr<State>(new State);
  state_->code = code;
  state_->msg = static_cast<std::string>(msg);
}

/// Returns the Canonical error code for the given errno value.
static FirestoreErrorCode CodeForErrno(int errno_code) {
  switch (errno_code) {
    case 0:
      return FirestoreErrorCode::Ok;

      // Internal canonical mappings call these failed preconditions, but for
      // our purposes these must indicate an internal error in file handling.
    case EBADF:  // Invalid file descriptor
#if defined(EBADFD)
    case EBADFD:  // File descriptor in bad state
#endif
      return FirestoreErrorCode::Internal;

    case EINVAL:        // Invalid argument
    case ENAMETOOLONG:  // Filename too long
    case E2BIG:         // Argument list too long
    case EDESTADDRREQ:  // Destination address required
    case EDOM:          // Mathematics argument out of domain of function
    case EFAULT:        // Bad address
    case EILSEQ:        // Illegal byte sequence
    case ENOPROTOOPT:   // Protocol not available
    case ENOSTR:        // Not a STREAM
    case ENOTSOCK:      // Not a socket
    case ENOTTY:        // Inappropriate I/O control operation
    case EPROTOTYPE:    // Protocol wrong type for socket
    case ESPIPE:        // Invalid seek
      return FirestoreErrorCode::InvalidArgument;

    case ETIMEDOUT:  // Connection timed out
    case ETIME:      // Timer expired
      return FirestoreErrorCode::DeadlineExceeded;

    case ENODEV:  // No such device
    case ENOENT:  // No such file or directory
#if defined(ENOMEDIUM)
    case ENOMEDIUM:  // No medium found
#endif
    case ENXIO:  // No such device or address
    case ESRCH:  // No such process
      return FirestoreErrorCode::NotFound;

    case EEXIST:         // File exists
    case EADDRNOTAVAIL:  // Address not available
    case EALREADY:       // Connection already in progress
#if defined(ENOTUNIQ)
    case ENOTUNIQ:  // Name not unique on network
#endif
      return FirestoreErrorCode::AlreadyExists;

    case EPERM:   // Operation not permitted
    case EACCES:  // Permission denied
#if defined(ENOKEY)
    case ENOKEY:  // Required key not available
#endif
    case EROFS:  // Read only file system
      return FirestoreErrorCode::PermissionDenied;

    case ENOTEMPTY:   // Directory not empty
    case EISDIR:      // Is a directory
    case ENOTDIR:     // Not a directory
    case EADDRINUSE:  // Address already in use
    case EBUSY:       // Device or resource busy
    case ECHILD:      // No child processes
    case EISCONN:     // Socket is connected
#if defined(EISNAM)
    case EISNAM:  // Is a named type file
#endif
    case ENOTBLK:    // Block device required
    case ENOTCONN:   // The socket is not connected
    case EPIPE:      // Broken pipe
    case ESHUTDOWN:  // Cannot send after transport endpoint shutdown
    case ETXTBSY:    // Text file busy
#if defined(EUNATCH)
    case EUNATCH:  // Protocol driver not attached
#endif
      return FirestoreErrorCode::FailedPrecondition;

    case ENOSPC:   // No space left on device
    case EDQUOT:   // Disk quota exceeded
    case EMFILE:   // Too many open files
    case EMLINK:   // Too many links
    case ENFILE:   // Too many open files in system
    case ENOBUFS:  // No buffer space available
    case ENODATA:  // No message is available on the STREAM read queue
    case ENOMEM:   // Not enough space
    case ENOSR:    // No STREAM resources
    case EUSERS:   // Too many users
      return FirestoreErrorCode::ResourceExhausted;

#if defined(ECHRNG)
    case ECHRNG:  // Channel number out of range
#endif
    case EFBIG:      // File too large
    case EOVERFLOW:  // Value too large to be stored in data type
    case ERANGE:     // Result too large
      return FirestoreErrorCode::OutOfRange;

#if defined(ENOPKG)
    case ENOPKG:  // Package not installed
#endif
    case ENOSYS:           // Function not implemented
    case ENOTSUP:          // Operation not supported
    case EAFNOSUPPORT:     // Address family not supported
    case EPFNOSUPPORT:     // Protocol family not supported
    case EPROTONOSUPPORT:  // Protocol not supported
    case ESOCKTNOSUPPORT:  // Socket type not supported
    case EXDEV:            // Improper link
      return FirestoreErrorCode::Unimplemented;

    case EAGAIN:  // Resource temporarily unavailable
#if defined(ECOMM)
    case ECOMM:  // Communication error on send
#endif
    case ECONNREFUSED:  // Connection refused
    case ECONNABORTED:  // Connection aborted
    case ECONNRESET:    // Connection reset
    case EINTR:         // Interrupted function call
    case EHOSTDOWN:     // Host is down
    case EHOSTUNREACH:  // Host is unreachable
    case ENETDOWN:      // Network is down
    case ENETRESET:     // Connection aborted by network
    case ENETUNREACH:   // Network unreachable
    case ENOLCK:        // No locks available
    case ENOLINK:       // Link has been severed
#if defined(ENONET)
    case ENONET:  // Machine is not on the network
#endif
      return FirestoreErrorCode::Unavailable;

    case EDEADLK:  // Resource deadlock avoided
    case ESTALE:   // Stale file handle
      return FirestoreErrorCode::Aborted;

    case ECANCELED:  // Operation cancelled
      return FirestoreErrorCode::Cancelled;

    default: { return FirestoreErrorCode::Unknown; }
  }
}

Status Status::FromErrno(int errno_code, absl::string_view msg) {
  FirestoreErrorCode canonical_code = CodeForErrno(errno_code);
  return Status{canonical_code,
                util::StringFormat("%s (errno %s: %s)", msg, errno_code,
                                   StrError(errno_code))};
}

void Status::Update(const Status& new_status) {
  if (ok()) {
    *this = new_status;
  }
}

void Status::SlowCopyFrom(const State* src) {
  if (src == nullptr) {
    state_ = nullptr;
  } else {
    state_ = std::unique_ptr<State>(new State(*src));
  }
}

const std::string& Status::empty_string() {
  static std::string* empty = new std::string;
  return *empty;
}

std::string Status::ToString() const {
  if (state_ == nullptr) {
    return "OK";
  } else {
    std::string result;
    switch (code()) {
      case FirestoreErrorCode::Cancelled:
        result = "Cancelled";
        break;
      case FirestoreErrorCode::Unknown:
        result = "Unknown";
        break;
      case FirestoreErrorCode::InvalidArgument:
        result = "Invalid argument";
        break;
      case FirestoreErrorCode::DeadlineExceeded:
        result = "Deadline exceeded";
        break;
      case FirestoreErrorCode::NotFound:
        result = "Not found";
        break;
      case FirestoreErrorCode::AlreadyExists:
        result = "Already exists";
        break;
      case FirestoreErrorCode::PermissionDenied:
        result = "Permission denied";
        break;
      case FirestoreErrorCode::Unauthenticated:
        result = "Unauthenticated";
        break;
      case FirestoreErrorCode::ResourceExhausted:
        result = "Resource exhausted";
        break;
      case FirestoreErrorCode::FailedPrecondition:
        result = "Failed precondition";
        break;
      case FirestoreErrorCode::Aborted:
        result = "Aborted";
        break;
      case FirestoreErrorCode::OutOfRange:
        result = "Out of range";
        break;
      case FirestoreErrorCode::Unimplemented:
        result = "Unimplemented";
        break;
      case FirestoreErrorCode::Internal:
        result = "Internal";
        break;
      case FirestoreErrorCode::Unavailable:
        result = "Unavailable";
        break;
      case FirestoreErrorCode::DataLoss:
        result = "Data loss";
        break;
      default:
        result = StringFormat("Unknown code(%s)", code());
        break;
    }
    result += ": ";
    result += state_->msg;
    return result;
  }
}

void Status::IgnoreError() const {
  // no-op
}

std::string StatusCheckOpHelperOutOfLine(const Status& v, const char* msg) {
  HARD_ASSERT(!v.ok());
  std::string r("Non-OK-status: ");
  r += msg;
  r += " status: ";
  r += v.ToString();
  return r;
}

}  // namespace util
}  // namespace firestore
}  // namespace firebase
