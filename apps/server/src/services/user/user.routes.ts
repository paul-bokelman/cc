import { Router } from 'express';
import * as controllers from './controllers';
import { isAuthenticated } from 'middleware/authentication';
import { validate } from 'middleware/validation';

export const user = Router();

user.get('/', isAuthenticated({ role: 'MEMBER' }), controllers.getUser);
