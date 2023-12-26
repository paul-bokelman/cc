import { Router } from "express";
import { authorized } from "~/middleware";
import { getUser } from "./controllers";

export const user = Router();

user.get("/", authorized({ role: "STUDENT" }), getUser.handler);
