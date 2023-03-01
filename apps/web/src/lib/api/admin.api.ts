import type { GetAdminClubs } from '@/cc';
import { query } from './api';

const getClubs = query<GetAdminClubs>('/admin/clubs');

export const admin = {
  clubs: getClubs,
};
