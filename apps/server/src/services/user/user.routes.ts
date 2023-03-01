import { Router } from 'express';
import * as controllers from './controllers';
import { isAuthorized } from 'middleware/authentication';
import { validate } from 'middleware/validation';

export const user = Router();

user.get('/', isAuthorized({ role: 'MEMBER' }), controllers.getUser);
