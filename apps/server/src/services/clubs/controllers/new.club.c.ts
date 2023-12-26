import { Controller, NewClub, newClubSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError, generate } from "~/lib/utils";

const handler: Controller<NewClub> = async (req, res) => {
  const { success, validationError } = formatResponse<NewClub>(res);
  const club = req.body;
  const { tags, ...rest } = club;

  const existingClub = await prisma.club.findFirst({
    where: { AND: { name: club.name }, school: { name: req.school } },
    select: { name: true },
  });

  if (existingClub) {
    const slug = generate.slug(club.name);
    const existingSlug = await prisma.club.findFirst({ where: { AND: { slug, school: { name: req.school } } } });
    if (existingSlug) return validationError([{ path: "name", message: "Club name already taken" }]);
  }

  if (club.tags) {
    const tags = await prisma.tag.findMany({ where: { name: { in: club.tags } } });
    if (tags.length !== club.tags.length)
      return validationError([{ path: "tags", message: "One or more tags are invalid" }]);
  }

  try {
    const { id } = await prisma.club.create({
      data: {
        slug: generate.slug(rest.name),
        tags: { connect: tags.map((name) => ({ name })) },
        school: { connect: { name: req.school } },
        ...rest,
      },
    });

    return success(StatusCodes.OK, { id });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const newClub = { handler, schema: newClubSchema };
