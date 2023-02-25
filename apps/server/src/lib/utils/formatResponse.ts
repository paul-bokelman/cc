import type { Response } from 'express';
import type { ControllerConfig, ServerError } from '~/types';
import { getReasonPhrase } from 'http-status-codes';

export const formatResponse = <C extends ControllerConfig>(res: Response) => {
  return {
    success: (status: number, payload: C['payload']) => {
      return res.status(status).json(payload);
    },
    error: (status: number, message?: string): Response<ServerError> => {
      return res.status(status).json({
        code: status,
        reason: getReasonPhrase(status),
        message: message ?? undefined,
      });
    },
  };
};
