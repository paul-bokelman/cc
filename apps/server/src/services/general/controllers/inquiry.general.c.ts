import { Controller, Inquiry, inquirySchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { prisma } from "~/config";
import { formatResponse, handleControllerError } from "~/lib/utils";

const handler: Controller<Inquiry> = async (req, res) => {
  const inquiry = req.body;
  const { success } = formatResponse<Inquiry>(res);

  try {
    const newInquiry = await prisma.inquiry.create({
      data: {
        email: inquiry.email,
        message: inquiry.message,
        name: `${inquiry.firstName} ${inquiry.lastName}`,
      },
    });

    return success(StatusCodes.OK, { id: newInquiry.id });
  } catch (e) {
    return handleControllerError(e, res);
  }
};

export const inquiry = { handler, schema: inquirySchema };
