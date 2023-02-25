import { customAlphabet as nanoid } from 'nanoid';
import { prisma } from '~/config';

const generateCCID = async (): Promise<string> => {
  const ccid = nanoid('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)();
  const user = await prisma.user.findUnique({ where: { ccid } });
  if (user) return generateCCID();
  return ccid;
};

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const generate = { ccid: generateCCID, slug: generateSlug };
