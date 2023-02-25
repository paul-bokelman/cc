import type { Controller } from 'types';
import type { Tag } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '~/config';
import { formatResponse, handleControllerError } from '~/lib/utils';

type GetTag = {
  args: {
    params: {
      id: string;
    };
  };
  payload: Tag;
};

export const getTagValidation = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const getTagHandler: Controller<GetTag> = async (req, res) => {
  const { error, success } = formatResponse<GetTag>(res);
  const { id } = req.params;

  try {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) return error(StatusCodes.NOT_FOUND, 'Tag not found');

    return success(StatusCodes.OK, tag);
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const getTag = { schema: getTagValidation, handler: getTagHandler };
