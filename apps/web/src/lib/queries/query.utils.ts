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

/* ------------------------------ Query Client ------------------------------ */
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false, refetchIntervalInBackground: false },
    mutations: { retry: false },
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
export const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL, ...defaultHeaders });
export const nextClient = axios.create({ baseURL: "/api", ...defaultHeaders });

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

type APIRequest = <C extends ControllerConfig>(
  path: string,
  next?: boolean
) => (args?: Omit<C, "payload">) => Promise<C["payload"]>; //? do return function need to be async?

// type QueryFunction = <C extends ControllerConfig>(
//   path: string,
//   next?: boolean
// ) => (args?: Omit<C, "payload" | "body">) => Promise<C["payload"]>;

// type MutationFunction = <C extends ControllerConfig>(
//   path: string,
//   next?: boolean
// ) => (args?: Omit<C, "payload">) => Promise<C["payload"]>;

export const query: APIRequest = (path, next) => {
  const executionClient = next ? nextClient : client;
  return async (args) => {
    const { body, ...rest } = args ?? { body: undefined };
    if (body) throw new Error("Body not processed in query operation, use mutation");
    const formattedPath = pathFromArgs(path, rest);
    const { data } = await executionClient.get(formattedPath);
    return data;
  };
};

export const mutation: APIRequest = (path, next) => {
  const executionClient = next ? nextClient : client;
  return async (args) => {
    const { body, ...rest } = args ?? {};
    const formattedPath = pathFromArgs(path, rest);
    const { data } = await executionClient.post(formattedPath, body ?? undefined);
    return data;
  };
};