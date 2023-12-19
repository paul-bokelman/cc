import { type Controller, type EditClub, editClubSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError, generate } from "~/lib/utils";

const handler: Controller<EditClub> = async (req, res) => {
  const { success, error, validationError } = formatResponse<EditClub>(res);
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
      if (existingSlug) return validationError([{ path: "name", message: "Club name already taken" }]);
    }

    // check if tags exist
    if (club.tags) {
      const tags = await prisma.tag.findMany({ where: { name: { in: club.tags } } });
      if (tags.length !== club.tags.length)
        return validationError([{ path: "tags", message: "One or more tags are invalid" }]);
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
