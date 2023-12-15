export const bool = (v: string | number | undefined): boolean => {
  if (v === undefined) return false;
  if (typeof v === "string") return v === "true" ? true : v === "false" ? false : false;
  return v === 1 ? true : v === 0 ? false : false;
};

export const int = (v: string | number | undefined): number | undefined => {
  if (typeof v === "string") return parseInt(v);
  return v;
};
