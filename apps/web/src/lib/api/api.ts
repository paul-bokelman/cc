import type { MutationFunction } from 'react-query';
import type { ControllerConfig, ServerError } from '@/cc';
import axios, { type AxiosError } from 'axios';
import qs from 'qs';

type APIQueryWithArgs<C extends ControllerConfig> = (args: C['args']) => Promise<C['payload']>;
type APIQueryNoArgs<C extends ControllerConfig> = () => Promise<C['payload']>;

export type APIQuery<C extends ControllerConfig> = C['args'] extends undefined
  ? APIQueryNoArgs<C>
  : APIQueryWithArgs<C>;

export type APIMutation<C extends ControllerConfig> = MutationFunction<C['payload'], C['args']>;

export type Error = AxiosError<ServerError>;

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const nextClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const pathFromArgs = (
  initialPath: string,
  args?: { query?: Record<string, unknown>; params?: Record<string, unknown> }
): any => {
  if (!args) return initialPath;
  const tokens = initialPath.split('/');
  tokens.shift();

  const path: string[] = [];

  //! Clean up

  tokens.forEach((token) => {
    if (args.params) {
      if (token.includes('[')) {
        const param = token.replace(/\[|\]/g, '');
        Object.entries(args!.params!).forEach(([key, value]) => {
          if (key === param) return path.push(`/${value}`);
        });

        return;
      }
    }

    path.push(`/${token}`);
  });

  if (args.query) path.push(`?${qs.stringify(args.query)}`);

  return path.join('').trim();
};

export const query = <C extends ControllerConfig>(
  path: string,
  next?: boolean
): ((args?: C['args']) => Promise<C['payload']>) => {
  const executionClient = next ? nextClient : client;
  return async (args?: C['args']): Promise<C['payload']> => {
    const { body, ...rest } = args ?? { body: undefined };
    if (body) throw new Error('Body not processed in query operation, use mutation');
    const formattedPath = pathFromArgs(path, rest);
    const { data } = await executionClient.get<C['payload']>(formattedPath);
    return data;
  };
};

export const mutation = <C extends ControllerConfig>(
  path: string,
  next?: boolean
): ((args?: C['args']) => Promise<C['payload']>) => {
  const executionClient = next ? nextClient : client;
  return async (args?: C['args']): Promise<C['payload']> => {
    const { body, ...rest } = args;
    const formattedPath = pathFromArgs(path, rest);
    const { data } = await executionClient.post<C['payload']>(formattedPath, body ?? undefined);
    return data;
  };
};
