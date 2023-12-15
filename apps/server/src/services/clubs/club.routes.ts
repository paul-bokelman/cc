import { Router } from "express";
import { validate } from "~/middleware";
import { getClub, getClubs, newClub, editClub, deleteClub } from "./controllers";

export const clubs = Router();

clubs.get("/", validate(getClubs.schema), getClubs.handler);
clubs.get("/:identifier", validate(getClub.schema), getClub.handler);
clubs.post("/new", validate(newClub.schema), newClub.handler); // todo: add authorization
clubs.post("/:identifier/edit", validate(editClub.schema), editClub.handler); // todo: add authorization
clubs.post("/:identifier/delete", validate(deleteClub.schema), deleteClub.handler); // todo: add authorization
