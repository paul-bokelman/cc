import { Router } from "express";
import { validate } from "~/middleware";
import { inquiry } from "./controllers";

export const general = Router();

general.post("/inquiry", validate(inquiry.schema), inquiry.handler);
