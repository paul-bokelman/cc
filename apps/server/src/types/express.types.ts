import type { AuthenticatedUser } from "cc-common";

export interface AuthenticatedRequestPayload {
  sid: string;
  user: AuthenticatedUser;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request extends AuthenticatedRequestPayload {}
  }
}
