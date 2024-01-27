import { Controller, Authorization, authorizationSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { formatResponse } from "~/lib/utils";
import { isAuthorized } from "~/middleware";

const handler: Controller<Authorization> = async (req, res) => {
  const { success, error } = formatResponse<Authorization>(res);

  const auth = await isAuthorized(req.query.sid, { role: req.query.role });
  if (!auth.authorized) return error(StatusCodes.UNAUTHORIZED, auth.message);

  return success(StatusCodes.OK, { authorized: true });
};

export const authorize = { handler, schema: authorizationSchema };
