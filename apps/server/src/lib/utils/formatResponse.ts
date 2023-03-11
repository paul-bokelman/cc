import type { Response } from 'express';
import type { ControllerConfig, ServerError } from '@/cc';
import { getReasonPhrase } from 'http-status-codes';
import { env } from '~/lib/env';

export const formatResponse = <C extends ControllerConfig>(res: Response) => {
  return {
    success: (status: number, payload: C['payload'], cookie?: string | { clear: true }) => {
      if (cookie) {
        if (typeof cookie === 'string') {
          return res
            .status(status)
            .cookie('cc.sid', cookie, {
              domain: env('CLIENT_DOMAIN'),
              httpOnly: true,
              expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
              secure: true,
              sameSite: 'none',
            })
            .json(payload);
        }
        return res
          .status(status)
          .cookie('cc.sid', '', { expires: new Date(0) })
          .json(payload);
      }

      return res.status(status).json(payload);
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
