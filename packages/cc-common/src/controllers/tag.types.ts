import type { Tag } from "@prisma/client";
import type { ToControllerConfig } from "../utils.types";
import * as z from "zod";

/* -------------------------------- GET TAGS -------------------------------- */
export type GetTags = ToControllerConfig<typeof getTagsSchema, Array<Tag>>;
export const getTagsSchema = z.object({});

/* --------------------------------- GET TAG -------------------------------- */
export type GetTag = ToControllerConfig<typeof getTagSchema, Tag>;
export const getTagSchema = z.object({ params: z.object({ id: z.string() }) });

/* --------------------------------- NEW TAG -------------------------------- */
export type NewTag = ToControllerConfig<typeof newTagSchema, Tag>;
export const newTagSchema = z.object({ body: z.object({ name: z.string() }) });
