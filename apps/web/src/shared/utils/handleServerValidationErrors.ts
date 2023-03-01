import type { ServerError } from '@/cc';
import axios, { type AxiosError } from 'axios';

export const isValidationError = (e: any): e is AxiosError<ServerError> => {
  if (axios.isAxiosError<ServerError>(e)) {
    if (e.response.data.code === 400) return true;
  }
  return false;
};

export const handleServerValidationErrors = (e: any, setFieldError: (field: string, message: string) => void) => {
  if (!isValidationError(e)) return;

  for (const err of e.response.data.errors as Array<{ path: string; message: string }>) {
    setFieldError(err.path, err.message);
  }

  // e.response.data.errors.forEach((fieldError: { path: string; message: string }) =>
  //   setFieldError(fieldError.path, fieldError.message)
  // );
};

// bad req => validation err
