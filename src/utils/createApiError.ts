import { ApiError } from "../interfaces/common.interface";

export function createApiError(
  statusCode: number,
  message: string,
  isOperational = true
): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  Error.captureStackTrace(error, createApiError);

  return error as ApiError;
}
