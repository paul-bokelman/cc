import type { User } from '@prisma/client';

export interface UserSession {
  userId: User['id'];
  cookie: {
    expires: Date;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'none' | 'lax' | 'strict';
  };
}

export type AuthenticatedUser = Pick<
  User,
  'id' | 'username' | 'ccid' | 'avatar' | 'email' | 'role'
>;
