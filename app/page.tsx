import { getRequestContext } from '@cloudflare/next-on-pages'

async function getFromDb() {
  'use server'
  const db = getRequestContext().env.DB;
  return db.prepare('SELECT 42;').all();
}
export const runtime = 'edge';

export default async function Home() {

  const resp = await getFromDb();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <code>
        {
          JSON.stringify(resp)
        }
      </code>
    </main>
  );
}
