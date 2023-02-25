import { Router } from 'express';
import { getTag, getTags, newTag } from './controllers';
import { validate } from 'middleware/validation';

export const tags = Router();

tags.get('/', getTags.handler);
tags.get('/:id', validate(getTag.schema), getTag.handler);
tags.post('/new', validate(newTag.schema), newTag.handler);
