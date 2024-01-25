import { subdomains as validSubdomains } from "~/lib/utils";

export const parseSubdomain = (
  link?: string | URL
): { valid: false; reason: string } | { valid: true; subdomain: string } => {
  const prod = process.env.NODE_ENV === "production";
  if (!link && typeof window === "undefined") {
    return { valid: false, reason: "no link provided" };
  }
  if (!link && typeof window !== "undefined") {
    link = window.location.href;
  }
  const url = typeof link === "object" ? link : new URL(link as string);
  const dotOccurrences = url.hostname.split(".").length - 1;
  if (prod && dotOccurrences !== 2) return { valid: false, reason: "too many or too few subdomains" };
  if (!prod && dotOccurrences !== 1) return { valid: false, reason: "too many or too few subdomains" };
  const subdomain = url.hostname.split(".")[0];
  if (!validSubdomains.includes(subdomain)) return { valid: false, reason: "invalid subdomain" };

  return { valid: true, subdomain };
};

export const appendSubdomain = (subdomain: string, url: string): string => {
  if (!url) throw new Error("No url");
  const base = new URL(url);
  return `${base.protocol}//${subdomain}.${base.host}`;
};
