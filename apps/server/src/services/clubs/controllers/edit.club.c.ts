import { type Controller, type EditClub, editClubSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError, generate } from "~/lib/utils";

const handler: Controller<EditClub> = async (req, res) => {
  const { error, success } = formatResponse<EditClub>(res);
  const club = req.body;

  try {
    const existingClub = await prisma.club.findFirst({
      where: { [req.query.method]: req.params.identifier },
    });

    if (!existingClub) return error(StatusCodes.NOT_FOUND, "Club not found");

    // check if club name is taken
    if (club.name && existingClub && existingClub.name !== club.name) {
      const slug = generate.slug(club.name);
      const existingSlug = await prisma.club.findFirst({ where: { slug } });
      if (existingSlug) return error(StatusCodes.CONFLICT, "Club name already taken"); // todo: should throw zod error (for validation)
    }

    // check if tags exist
    if (club.tags) {
      const tags = await prisma.tag.findMany({ where: { name: { in: club.tags } } });
      if (tags.length !== club.tags.length) return error(StatusCodes.NOT_FOUND, "Tag not found"); // todo: throw zod error
    }

    const { tags, ...rest } = club ?? {};

    const { id } = await prisma.club.update({
      // todo: fix
      //@ts-ignore
      where: { [req.query.method]: req.params.identifier },
      data: {
        slug: club?.name ? generate.slug(club.name) : undefined,
        ...rest,
        tags: tags ? { set: tags?.map((name) => ({ name })) } : undefined,
      },
    });

    return success(StatusCodes.OK, { id });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const editClub = { handler, schema: editClubSchema };
