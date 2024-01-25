import type {
  QueryClientConfig,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";
import { QueryClient } from "react-query";
import type { ControllerConfig, ServerError } from "cc-common";
import axios, { type AxiosError } from "axios";
import qs from "qs";
import { parseSubdomain } from "~/lib/utils";

// todo: restructure file, it's a mess

/* ------------------------------ Query Client ------------------------------ */
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: { retry: 0, refetchOnWindowFocus: true, refetchIntervalInBackground: false },
    mutations: { retry: 0 },
  },
};

export const queryClient = new QueryClient(queryClientConfig);

/* ------------------------------ API Abstraction ----------------------------- */

export type Error = AxiosError<ServerError>;

// todo: unknown properties should be omitted (ok for now)
export type QueryHook<C extends ControllerConfig> = (
  args: Omit<C, "payload">,
  options?: UseQueryOptions<C["payload"], Error>
) => UseQueryResult<C["payload"], Error>;

export type MutationHook<C extends ControllerConfig> = (
  options?: UseMutationOptions<C["payload"], Error, Omit<C, "payload">>
) => UseMutationResult<C["payload"], Error, Omit<C, "payload">>;

axios.defaults.withCredentials = true; //? remove `defaultHeaders` if works
const defaultHeaders = { withCredentials: true, headers: { "Content-Type": "application/json" } };

// baseUrl computation is really weird here, but it works so I'm not touching it
export const client = axios.create({
  baseURL: `/api/${(() => {
    const p = parseSubdomain();
    if (!p.valid) return "";
    return p.subdomain;
  })()}`,
  ...defaultHeaders,
});

// doesn't really make sense here
const pathFromArgs = (initialPath: string, args?: { query?: unknown; params?: unknown }): any => {
  if (!args) return initialPath;
  const tokens = initialPath.split("/");
  tokens.shift();

  const path: string[] = [];

  for (const token of tokens) {
    if (args.params && token.includes("[")) {
      const param = token.replace(/\[|\]/g, "");
      Object.entries(args!.params!).forEach(([key, value]) => {
        if (key === param) return path.push(`/${value}`);
      });
      continue;
    }

    path.push(`/${token}`);
  }

  if (args.query) path.push(`?${qs.stringify(args.query)}`);

  return path.join("").trim();
};

/* ------------------------- API Request Abstraction ------------------------ */

type APIRequest = <C extends ControllerConfig>(path: string) => (args?: Omit<C, "payload">) => Promise<C["payload"]>;

export const query: APIRequest = (path) => {
  return async (args) => {
    const { body, ...rest } = args ?? { body: undefined };
    if (body) throw new Error("Body not processed in query operation, use mutation");
    const formattedPath = pathFromArgs(path, rest);
    const { data } = await client.get(formattedPath);
    return data;
  };
};

export const mutation: APIRequest = (path) => {
  return async (args) => {
    const { body, ...rest } = args ?? {};
    const formattedPath = pathFromArgs(path, rest);
    const { data } = await client.post(formattedPath, body ?? undefined);
    return data;
  };
};
