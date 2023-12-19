import type { ServerError } from "cc-common";
import axios from "axios";
import { toast } from "react-hot-toast";

export const handleResponseError = (
  e: unknown,
  options: string | { toast: boolean | string; broadcastValidationError?: boolean } = {
    toast: true,
    broadcastValidationError: false,
  }
) => {
  if (typeof options === "string") {
    options = { toast: options };
  }

  if (axios.isAxiosError<ServerError>(e)) {
    // for mutations that don't need to broadcast validation errors (form mutations handled by handleFormError)
    if (!options.broadcastValidationError && e.response?.status === 400) {
      return;
    }
    if (options.toast) {
      const message =
        e.response?.data.message ?? (typeof options.toast === "string" ? options.toast : "Something went wrong");
      toast.error(message);
      return;
    }
  }
};

export const handleFormError = (
  e: unknown,
  options: {
    toast?: boolean | string;
    setFieldError?: (field: string, message: string) => void;
    hideToastOnValidation?: boolean;
  } = {
    toast: true,
    hideToastOnValidation: false,
  }
): void => {
  if (axios.isAxiosError<ServerError>(e)) {
    // handle validation errors (bad req)
    if (e.response?.status === 400 && typeof options?.setFieldError === "function") {
      for (const err of e.response.data.errors as Array<{ path: string; message: string }>) {
        options.setFieldError(err.path, err.message);
      }
      if (!options.hideToastOnValidation) {
        const message = typeof options.toast === "string" ? options.toast : "Please fix the errors and try again";
        toast.error(message);
        return;
      }
      return;
    }
    // handle all other errors
    if (options.toast) {
      const message =
        e.response?.data.message ?? (typeof options.toast === "string" ? options.toast : "A server error occurred");
      toast.error(message);
      return;
    }
  }

  if (e instanceof Error) {
    // handle all other errors
    if (options.toast) {
      toast.error(e.message ?? "A client error occurred");
      return;
    }
  }

  if (options.toast) {
    toast.error("An unknown error occurred");
    return;
  }
};
