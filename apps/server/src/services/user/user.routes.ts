import { Router } from "express";
import { isAuthorized } from "~/middleware";
import { getUser } from "./controllers";

export const user = Router();

user.get("/", isAuthorized({ role: "MEMBER" }), getUser.handler);
