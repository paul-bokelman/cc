import type { Inquiry } from "cc-common";
import type { MutationHook, Error } from "./query.utils";
import { useMutation } from "react-query";
import { mutation } from "./query.utils";

/* ------------------------------- NEW INQUIRY ------------------------------ */
const newInquiry = mutation<Inquiry>("/general/inquiry");
export const useNewInquiry: MutationHook<Inquiry> = (options) => {
  return useMutation<Inquiry["payload"], Error, Omit<Inquiry, "payload">>(newInquiry, options);
};
