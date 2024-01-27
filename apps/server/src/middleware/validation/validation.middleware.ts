import { ControllerConfig } from "cc-common";
import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { type AnyZodObject, ZodError } from "zod";
import { formatResponse } from "~/lib/utils";

const formatPath = (path: (string | number)[]) => {
  const withoutDiscriminator = path.shift();
  return path.length ? path.join(".") : withoutDiscriminator;
};

export const validate = (schema: AnyZodObject): RequestHandler => {
  return async (req, res, next) => {
    const { error } = formatResponse(res);
    try {
      const parsed = await schema.parseAsync({ body: req.body, query: req.query, params: req.params });

      //? redefine because of zod transformations
      req.query = parsed?.query;
      req.params = parsed?.params;
      req.body = parsed?.body;

      return next();
    } catch (e) {
      if (e instanceof ZodError) {
        return error(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          e.errors.map((e) => ({ path: formatPath(e.path), message: e.message }))
        );
      }
      return error(StatusCodes.INTERNAL_SERVER_ERROR, "Validation Error");
    }
  };
};
