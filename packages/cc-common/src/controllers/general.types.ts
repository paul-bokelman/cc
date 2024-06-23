import type { ToControllerConfig } from "../utils.types";
import * as z from "zod";

/* --------------------------------- INQUIRY -------------------------------- */
export type Inquiry = ToControllerConfig<typeof inquirySchema, { id: string }>;
export const inquirySchema = z.object({
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    message: z.string(),
  }),
});
