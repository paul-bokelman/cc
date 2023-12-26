import { subdomains as validSubdomains } from "~/lib/utils";

export const parseSubdomain = (
  link: string | URL,
  prod: boolean
): { valid: false; reason: string } | { valid: true; subdomain: string } => {
  const url = typeof link === "object" ? link : new URL(link);
  const dotOccurrences = url.hostname.split(".").length - 1;
  if (prod && dotOccurrences !== 2) return { valid: false, reason: "too many or too few subdomains" };
  if (!prod && dotOccurrences !== 1) return { valid: false, reason: "too many or too few subdomains" };
  const subdomain = url.hostname.split(".")[0];
  if (!validSubdomains.includes(subdomain)) return { valid: false, reason: "invalid subdomain" };

  return { valid: true, subdomain };
};

export const appendSubdomain = (subdomain: string): string => {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) throw new Error("No server url");
  const base = new URL(process.env.NEXT_PUBLIC_SERVER_URL);
  return `${base.protocol}//${subdomain}.${base.host}`;
};
