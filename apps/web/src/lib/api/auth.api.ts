import type { Login, Register } from '@/cc';
import { query, mutation } from './api';

const login = mutation<Login>('/auth/login');
const register = mutation<Register>('/auth/register');
// const authorize = query<GetClub>('/clubs/[identifier]');

export const auth = {
  login,
  register,
};
