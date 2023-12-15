import { Router } from "express";
import { isAuthorized, validate } from "~/middleware";
import { login, register, logout, authorize } from "./controllers";

export const auth = Router();

auth.post("/register", validate(register.schema), register.handler);
auth.post("/login", validate(login.schema), login.handler);
auth.post("/logout", isAuthorized({ role: "MEMBER" }), logout.handler);
auth.post("/authorize", validate(authorize.schema), authorize.handler);
