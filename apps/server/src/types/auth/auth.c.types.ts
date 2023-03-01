import type { Role } from '@prisma/client';

/* -------------------------------------------------------------------------- */
/*                               AUTHENTICATION                               */
/* -------------------------------------------------------------------------- */

//! OUTDATED

export interface Authorization {
  args: {
    body: {
      role: Role;
      allow?: {
        unfinished?: boolean;
        unapplied?: boolean;
        unapproved?: boolean;
      };
      block?: {
        finished?: boolean;
      };
    };
  };
  payload: {
    authorized: boolean;
  };
}
