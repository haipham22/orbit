import type { ErrorCode } from "./error-codes";

export class ServiceError extends Error {
  constructor(public code: ErrorCode, message: string) {
    super(message);
  }
}
