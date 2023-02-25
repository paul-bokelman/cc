import type {
  GetClubs,
  GetClub,
  NewClub,
  EditClub,
  ControllerConfig,
} from '@/cc';
import { query } from './api';

type Query<C extends ControllerConfig> = (
  args?: C['args']
) => Promise<C['payload']>;

// export const getClubs: Query<GetClubs> = async (args) => {
//   console.log(args);
//   const { data } = await client.get<GetClubs['payload']>('/clubs');
//   return data;
// };

const getClubs = query<GetClubs>('/clubs');
// const getClub = query<GetClub>('/clubs/[identifier]');
// const newClub = mutation<NewClub>('/clubs/new');
// const editClub = mutation<EditClub>('/clubs/[identifier]/edit');

export const clubs = {
  all: getClubs,
  // all: query<GetClubs>('/clubs/'),
  // get: query<GetClub>('/clubs/[identifier]'),
  // new: mutation<NewClub>('/clubs/new'),
  // edit: mutation<EditClub>('/clubs/[identifier]/edit'),
};
