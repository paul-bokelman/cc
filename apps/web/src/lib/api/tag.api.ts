import type { GetTags } from '@/cc';
import { query } from './api';

const getTags = query<GetTags>('/tags');

export const tags = {
  all: getTags,
};
