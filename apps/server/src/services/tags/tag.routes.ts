import { Router } from "express";
import { validate } from "~/middleware";
import { getTag, getTags, newTag } from "./controllers";

export const tags = Router();

tags.get("/", getTags.handler);
tags.get("/:id", validate(getTag.schema), getTag.handler);
tags.post("/new", validate(newTag.schema), newTag.handler);
