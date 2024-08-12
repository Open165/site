import React from 'react';
// import { getRecords } from '@/app/name/util';
import ScamTabs from '@/components/ScamTabs';

export const runtime = 'edge';

type Props = { params: { name: string } };

export default async function Name({
  params: { name: encodedName },
  children,
}: React.PropsWithChildren<Props>) {
  const name = decodeURIComponent(encodedName).trim();
  // const [directHits, ftsHits] = await getRecords(name);

  return (
    <main>
      <h1 className="font-serif font-light text-6xl">{name}</h1>
      <ScamTabs name={name} basePath={`/name/${encodedName}`} />
      {children}
    </main>
  );
}
