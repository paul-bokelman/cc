export * from './api';
export * from './club.api';
export * from './tag.api';
export * from './admin.api';
export * from './auth.api';
export * from './user.api';
export * from './qc';

import { clubs, tags, admin, auth, user } from '.';

export const api = {
  clubs,
  tags,
  admin,
  auth,
  user,
};
