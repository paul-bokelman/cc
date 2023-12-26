import { Router } from "express";
import { authorized, validate } from "~/middleware";
import { login, register, logout, authorize } from "./controllers";

export const auth = Router();

auth.post("/register", validate(register.schema), register.handler);
auth.post("/login", validate(login.schema), login.handler);
auth.post("/logout", authorized({ role: "STUDENT" }), logout.handler);
auth.get("/authorized", validate(authorize.schema), authorize.handler);
// auth.post("/authorize", validate(authorize.schema), authorize.handler);
