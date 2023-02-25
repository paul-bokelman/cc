import type { RequestHandler } from 'express';
import type { ControllerConfig, ServerError, AuthenticatedUser } from '.';

interface AuthenticatedRequestPayload {
  sid: string;
  user: AuthenticatedUser;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request extends AuthenticatedRequestPayload {}
  }
}

export type Controller<C extends ControllerConfig> = RequestHandler<
  PossiblyUndefined<C['args'], 'params'>,
  C['payload'] | ServerError,
  PossiblyUndefined<C['args'], 'body'>,
  PossiblyUndefined<C['args'], 'query'>
>;

type PossiblyUndefined<
  A extends ControllerConfig['args'],
  K
> = A extends undefined ? unknown : K extends keyof A ? A[K] : unknown;
