import { Router } from 'express';
import { getClub, getClubs, newClub, editClub } from './controllers';
import { validate } from 'middleware/validation';

export const clubs = Router();

clubs.get('/', validate(getClubs.schema), getClubs.handler);
clubs.get('/:identifier', validate(getClub.schema), getClub.handler);
clubs.post('/new', validate(newClub.schema), newClub.handler);
clubs.post('/:identifier/edit', validate(editClub.schema), editClub.handler);
