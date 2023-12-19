import type { Response } from "express";
import type { ControllerConfig, ServerError, ValidationErrors } from "cc-common";
import { getReasonPhrase } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { cookieOptions } from "~/lib/session";

export const handleControllerError = (e: unknown, res: Response) => {
  const { error } = formatResponse(res as Response<ServerError>);

  if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Error) {
    return error(StatusCodes.INTERNAL_SERVER_ERROR, `Unhandled Exception: ${e.message}`);
  }

  return error(StatusCodes.INTERNAL_SERVER_ERROR);
};

export const formatResponse = <C extends ControllerConfig>(res: Response) => {
  return {
    success: (status: number, payload: C["payload"], cookie?: string | { clear: true }) => {
      if (cookie) {
        if (typeof cookie === "string") {
          return res.status(status).cookie("cc.sid", cookie, cookieOptions).json(payload);
        }
        return res
          .status(status)
          .cookie("cc.sid", "", { expires: new Date(0) })
          .json(payload);
      }

      return res.status(status).json(payload);
    },
    error: (status: number, message?: string, errors?: unknown): Response<ServerError> => {
      return res.status(status).json({
        code: status,
        reason: getReasonPhrase(status),
        message: message ?? undefined,
        errors,
      });
    },
    validationError: (errors: ValidationErrors): Response<ServerError> => {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        reason: getReasonPhrase(StatusCodes.BAD_REQUEST),
        message: "Validation Error",
        errors,
      });
    },
  };
};
