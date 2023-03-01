export * from './api';
export * from './club.api';
export * from './tag.api';
export * from './admin.api';
export * from './auth.api';
export * from './qc';

import { clubs, tags, admin, auth } from '.';

export const api = {
  clubs,
  tags,
  admin,
  auth,
};
