import { Controller, NewClub, newClubSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError, generate } from "~/lib/utils";

const handler: Controller<NewClub> = async (req, res) => {
  const { success, error } = formatResponse<NewClub>(res);
  const club = req.body;
  const { tags, ...rest } = club;

  const existingClub = await prisma.club.findUnique({ where: { name: club.name }, select: { name: true } });

  if (existingClub) {
    const slug = generate.slug(club.name);
    const existingSlug = await prisma.club.findFirst({ where: { slug } });
    if (existingSlug) return error(StatusCodes.CONFLICT, "Club name already taken"); // todo: should throw zod error (for client reflection)
  }

  if (club.tags) {
    const tags = await prisma.tag.findMany({ where: { name: { in: club.tags } } });
    if (tags.length !== club.tags.length) return error(StatusCodes.NOT_FOUND, "Tag not found"); // todo: throw zod error
  }

  try {
    const { id } = await prisma.club.create({
      data: {
        slug: generate.slug(rest.name),
        tags: { connect: tags.map((name) => ({ name })) },
        ...rest,
      },
    });

    return success(StatusCodes.OK, { id });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const newClub = { handler, schema: newClubSchema };
