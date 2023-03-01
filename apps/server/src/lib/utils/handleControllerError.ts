import type { Response } from 'express';
import type { ServerError } from '@/cc';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { formatResponse } from '~/lib/utils';

//! This really needs to be more robust

export const handleControllerError = (error: unknown, res: Response<ServerError>) => {
  const { error: err } = formatResponse(res);

  if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Error) {
    return err(StatusCodes.INTERNAL_SERVER_ERROR, `Unhandled Exception: ${error.message}`);
  }

  return err(StatusCodes.INTERNAL_SERVER_ERROR);
};
