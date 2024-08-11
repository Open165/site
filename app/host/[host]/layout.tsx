import type React from 'react';
// import { getRecords } from '@/app/host/util';

import ScamTabs from '@/components/ScamTabs';

type Props = { params: { host: string } };

export const runtime = 'edge';

export default async function Host({
  params: { host },
  children,
}: React.PropsWithChildren<Props>) {
  // const [directHits, ftsHits] = await getRecords(host);

  return (
    <main>
      <h1>{host}</h1>
      <ScamTabs name={host} basePath={`/host/${host}`} />
      {children}
    </main>
  );
}
