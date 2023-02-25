import type { Controller } from 'types';
import type { GetUser } from '@/cc';
import { StatusCodes } from 'http-status-codes';

export const getUser: Controller<GetUser> = async (req, res) => {
  return res.status(StatusCodes.OK).json(req.user);
};
