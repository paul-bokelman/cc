import { Router } from "express";
import { auth } from "./auth";
import { user } from "./user";
import { tags } from "./tags";
import { clubs } from "./clubs";
import { admin } from "./admin";
import { general } from "./general";

export const schoolServices = Router();

schoolServices.use("/auth", auth);
schoolServices.use("/user", user);
schoolServices.use("/tags", tags);
schoolServices.use("/clubs", clubs);
schoolServices.use("/admin", admin);

export const generalServices = Router();
generalServices.use("/", general);
