import React from 'react';
import { getRecords, getSummary } from '@/app/name/util';
import ScamTabs from '@/components/ScamTabs';
import { Heading, Paragraph } from '@/components/contents';

export const runtime = 'edge';

type Props = { params: { name: string } };

export default async function Name({
  params: { name: encodedName },
  children,
}: React.PropsWithChildren<Props>) {
  const name = decodeURIComponent(encodedName).trim();
  const [directHits] = await getRecords(name);

  return (
    <main>
      <Heading>{name}</Heading>
      <Paragraph>{getSummary(name, directHits)}</Paragraph>
      <ScamTabs name={name} basePath={`/name/${encodedName}`} />
      {children}
    </main>
  );
}
