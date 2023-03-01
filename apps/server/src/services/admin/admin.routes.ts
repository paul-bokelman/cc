import { Router } from 'express';
import { getAdminClubs } from './controllers';
import { validate } from '~/middleware/validation';

export const admin = Router();

admin.get('/clubs', validate(getAdminClubs.schema), getAdminClubs.handler);
