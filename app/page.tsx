import { getPrisma } from '@/lib/db'

export const runtime = 'edge';

export default async function Home() {

  const prisma = getPrisma();
  const count = await prisma.scamSiteRecord.count();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <code>
        {
          JSON.stringify({count})
        }
      </code>
    </main>
  );
}
