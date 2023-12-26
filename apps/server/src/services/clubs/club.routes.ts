import { Router } from "express";
import { validate, authorized } from "~/middleware";
import { getClub, getClubs, newClub, editClub, deleteClub } from "./controllers";

export const clubs = Router();

clubs.get("/", validate(getClubs.schema), getClubs.handler);
clubs.get("/:identifier", validate(getClub.schema), getClub.handler);
clubs.post("/new", authorized({ role: "ADMIN" }), validate(newClub.schema), newClub.handler);
clubs.post("/:identifier/edit", authorized({ role: "ADMIN" }), validate(editClub.schema), editClub.handler);
clubs.post("/:identifier/delete", authorized({ role: "ADMIN" }), validate(deleteClub.schema), deleteClub.handler);
