import type { MutationFunction } from 'react-query';
import type { ControllerConfig, ServerError } from '@/cc';
import axios, { type AxiosError } from 'axios';

type APIQueryWithArgs<C extends ControllerConfig> = (
  args: C['args']
) => Promise<C['payload']>;
type APIQueryNoArgs<C extends ControllerConfig> = () => Promise<C['payload']>;

export type APIQuery<C extends ControllerConfig> = C['args'] extends undefined
  ? APIQueryNoArgs<C>
  : APIQueryWithArgs<C>;

export type APIMutation<C extends ControllerConfig> = MutationFunction<
  C['payload'],
  C['args']
>;

export type Error = AxiosError<ServerError>;

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

  if (!args.params || !args.query) return initialPath;

  if (args.params) {
    tokens.forEach((token) => {
      if (token.includes('[')) {
        const param = token.replace(/\[|\]/g, '');
        Object.entries(args!.params!).forEach(([key, value]) => {
          if (key === param) return path.push(`/${value}`);
        });
        return;
      }
      return path.push(`/${token}`);
    });
  }

  if (args.query) {
    const keys = Object.keys(args.query);
    const lastKey = args.query[keys[keys.length - 1]];
    Object.entries(args.query).forEach(([key, value]) => {
      const formattedValue = Array.isArray(value) ? value.join(',') : value;
      return path.push(
        `?${key}=${formattedValue}${
          key !== lastKey && keys.length > 1 ? '&' : ''
        }`
      );
    });
  }

  return path.join('').trim();
};

export const query = <C extends ControllerConfig>(
  path: string
): ((args?: C['args']) => Promise<C['payload']>) => {
  return async (args?: C['args']): Promise<C['payload']> => {
    const { body, ...rest } = args ?? { body: undefined };
    if (body) throw new Error('Body not processed in query operation');
    path = pathFromArgs(path, rest);
    console.log(path);
    const { data } = await client.get<C['payload']>(path);
    return data;
  };
};

export const mutation = <C extends ControllerConfig>(
  path: string
): ((args?: C['args']) => Promise<C['payload']>) => {
  return async (args?: C['args']): Promise<C['payload']> => {
    const { body, ...rest } = args;
    path = pathFromArgs(path, rest);
    const { data } = await client.post<C['payload']>(path, body ?? undefined);
    return data;
  };
};

// export const nextClient = axios.create({
//   baseURL: '/api',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// import { clubs } from './club.api';

// export const api = {
//   clubs: clubs,
// };
