import type { Response } from 'express';
import type { ControllerConfig, ServerError } from '@/cc';
import { getReasonPhrase } from 'http-status-codes';

export const formatResponse = <C extends ControllerConfig>(res: Response) => {
  return {
    success: (status: number, payload: C['payload'], cookie?: string) => {
      return cookie ? res.status(status).cookie('cc.sid', cookie).json(payload) : res.status(status).json(payload);
    },
    error: (status: number, message?: string, errors?: unknown): Response<ServerError> => {
      return res.status(status).json({
        code: status,
        reason: getReasonPhrase(status),
        message: message ?? undefined,
        errors,
      });
    },
  };
};
