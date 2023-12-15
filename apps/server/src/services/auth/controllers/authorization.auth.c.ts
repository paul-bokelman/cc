import { Controller, Authorization, authorizationSchema } from "cc-common";
import { StatusCodes } from "http-status-codes";
import { getSession } from "~/lib/session";
import { unsignCookie } from "~/lib/session/utils";
import { formatResponse } from "~/lib/utils";

const roleHierarchy = ["MEMBER", "SCHOLAR", "MANAGER", "ADMIN"];

const handler: Controller<Authorization> = async (req, res) => {
  const { success, error } = formatResponse<Authorization>(res);
  const signedCookie = req.body.signedCookie ?? ""; // wish I could get this from cookies...

  // todo: null or undefined should be assignable
  (req.user as unknown) = null;
  (req.sid as unknown) = null;

  if (!signedCookie) return error(StatusCodes.UNAUTHORIZED, "No session");

  const { role = "MEMBER" } = req.body ?? {};

  try {
    const sid = unsignCookie(signedCookie);
    const user = await getSession(sid);

    if (!(roleHierarchy.indexOf(user.role) >= roleHierarchy.indexOf(role)))
      return error(StatusCodes.UNAUTHORIZED, "Insufficient role");

    return success(StatusCodes.OK, { authorized: true });
  } catch (e) {
    if (e instanceof Error) return error(StatusCodes.UNAUTHORIZED, e.message);
    return error(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
export const authorize = { handler, schema: authorizationSchema };
