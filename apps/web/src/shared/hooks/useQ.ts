import * as React from "react";
import { useRouter } from "next/router";
import qs from "qs";

export const parseQ = (path: string) => qs.parse(path.split("?")[1]);

export const useQ = <Query extends Partial<Query>>() => {
  const router = useRouter();

  const [q, setQ] = React.useState<Query>(parseQ(router.asPath) as Query);

  const append = (query: { [K in keyof Query]: Query[K] }) => {
    let updatedQuery = parseQ(router.asPath) as Query;
    Object.entries(query).forEach(([key, value]) => {
      if (value === null) {
        if (key in updatedQuery) delete updatedQuery[key as keyof Query];
      } else {
        updatedQuery = { ...updatedQuery, [key]: value };
      }
    });

    setQ(updatedQuery);
    router.push({ query: qs.stringify(updatedQuery) }, undefined, { shallow: true });
  };

  const get = (key?: keyof Query) => {
    if (key) return q[key];
    return q;
  };

  const clear = (key: keyof Query) => {
    const updatedQuery = parseQ(router.asPath) as Query;
    delete updatedQuery[key];
    setQ(updatedQuery);
    router.push({ query: qs.stringify(updatedQuery) }, undefined, { shallow: true });
  };

  return {
    query: q,
    append,
    get,
    parse: parseQ,
    clear,
  };

  // append, replace, get
};
