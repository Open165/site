import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { getRequestContext } from '@cloudflare/next-on-pages';

export function getPrisma() {
  const db = getRequestContext().env.DB;
  const adapter = new PrismaD1(db);
  return new PrismaClient({ adapter });
}
