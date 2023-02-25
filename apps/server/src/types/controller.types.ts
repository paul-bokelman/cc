import { ReasonPhrases } from 'http-status-codes';

export interface ControllerConfig {
  args:
    | {
        params?: Record<string, unknown> | undefined;
        body?: Record<string, unknown> | undefined;
        query?: Record<string, unknown> | undefined;
      }
    | undefined;
  payload: Record<string, unknown> | Record<string, unknown>[] | undefined;
}

export type ServerError = {
  code: number;
  reason: ReasonPhrases;
  message?: string;
};
