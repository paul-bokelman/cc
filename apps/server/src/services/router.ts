import { Router } from 'express';
import { auth } from './auth';
import { user } from './user';
import { tags } from './tags';
import { clubs } from './clubs';
import { admin } from './admin';

export const services = Router();

services.use('/auth', auth);
services.use('/user', user);
services.use('/tags', tags);
services.use('/clubs', clubs);
services.use('/admin', admin);
