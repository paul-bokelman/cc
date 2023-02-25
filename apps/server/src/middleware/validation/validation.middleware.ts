import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AnyZodObject } from 'zod';
import { ZodError } from 'zod';

const formatPath = (path: (string | number)[]) => {
  const withoutDiscriminator = path.shift();
  return path.length ? path.join('.') : withoutDiscriminator;
};

export const validate = (schema: AnyZodObject): RequestHandler => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Validation error',
          errors: error.errors.map((e) => ({
            path: formatPath(e.path),
            message: e.message,
          })),
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Validation Error',
        error: 'Internal Server Error',
      });
    }
  };
};
