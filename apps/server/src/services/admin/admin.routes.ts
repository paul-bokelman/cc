import { Router } from "express";
import { validate } from "~/middleware";
import { getAdminClubs } from "./controllers";

export const admin = Router();

admin.get("/clubs", validate(getAdminClubs.schema), getAdminClubs.handler);
