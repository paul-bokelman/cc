import { Router } from 'express';
import { login, register, logout } from './controllers';
import { isAuthenticated } from 'middleware/authentication';
import { validate } from 'middleware/validation';

export const auth = Router();

// auth.post('/authorization', controllers.authorization); //! NOT UPDATED, use isAuthenticated middleware to check if user is authorized

auth.post('/register', validate(register.schema), register.handler);
auth.post('/login', validate(login.schema), login.handler);
auth.post('/logout', isAuthenticated({ role: 'MEMBER' }), logout.handler);
