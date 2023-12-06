import type { GetUser } from '@/cc';
import { query } from './api';

const getUser = query<GetUser>('/user');

export const user = {
  get: getUser,
};