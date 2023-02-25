import type { UserSession, AuthenticatedUser } from 'types';
import { client, prisma } from 'config';
import { destroySession } from '.';

type GetSession = (sid: string) => Promise<AuthenticatedUser>;

export const getSession: GetSession = async (sid) => {
  try {
    const session = await client.get(`sessions:${sid}`);
    if (!session) throw new Error('Failed to get session');
    const { userId, cookie }: UserSession = JSON.parse(session);

    if (cookie.expires < new Date()) {
      await destroySession(sid);
      throw new Error('Session expired');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        ccid: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
      },
    });

    if (!user) throw new Error('No user associated with session');

    return user;
  } catch (error) {
    throw new Error('Malformed session data');
  }
};
