import type { CookieOptions } from 'express';
import { nanoid } from 'nanoid';
import { client } from 'config';
import { env } from 'lib/env';
import { signCookie } from 'lib/session/utils';

type GenerateSession = (userId: string) => Promise<string>;

export const generateSession: GenerateSession = async (userId) => {
  if (!userId) throw new Error('User id is required');

  const sid = nanoid();

  const cookie: CookieOptions = {
    domain: env('CLIENT_DOMAIN'),
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: true,
    sameSite: 'none',
  };

  try {
    await client.set(`sessions:${sid}`, JSON.stringify({ userId, cookie }));
    // set ttl
    // await client.expire(`sessions:${sid}`, 24 * 60 * 60 * 1000);
    const signedCookie = signCookie(sid);
    return signedCookie;
  } catch (error) {
    throw new Error('Failed to generate session');
  }
};
