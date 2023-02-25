import { type User, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

// use validators

export const users: Array<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    ccid: 'HXJRIF',
    username: 'admin',
    avatar: null,
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('password', 10),
    role: 'ADMIN',
  },
];
