import { Login, Register, Authorization, Logout } from '@/cc';
import { mutation } from './api';

const login = mutation<Login>('/auth/login');
const register = mutation<Register>('/auth/register');
const authorize = mutation<Authorization>('/auth/authorize');
const logout = mutation<Logout>('/auth/logout');

export const auth = {
  login,
  register,
  authorize,
  logout,
};
