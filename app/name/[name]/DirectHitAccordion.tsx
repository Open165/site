'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Chip } from '@nextui-org/chip';

type Props = {
  /** Scam site report with direct hit */
  directHits: {
    id: number;
    name: string;
    count: number;
    startDate: string;
    endDate: string;
    host: string;
    announcementId: number;
    announcementTitle: string;
  }[];
};

export default function DirectHitAccordion({ directHits }: Props) {
  // directHits are already sorted by endDate desc.
  // We group them by host, latest endDate first.
  const directHitsByHosts = useMemo(
    () =>
      directHits.reduce((acc, record) => {
        const host = record.host;
        const recordsOfHost = acc.get(host);
        if (recordsOfHost) {
          recordsOfHost.push(record);
        } else {
          acc.set(host, [record]);
        }
        return acc;
      }, new Map<string, Props['directHits']>()),
    [directHits]
  );

  return (
    <Accordion
      variant="bordered"
      selectionMode="multiple"
      // Open first host by default
      defaultExpandedKeys={[directHits[0].host]}
    >
      {Array.from(directHitsByHosts.entries()).map(([host, records]) => (
        <AccordionItem
          key={host}
          title={host}
          subtitle={`${records[records.length - 1].startDate} ~ ${records[0].endDate} 共通報 ${records.reduce((sum, { count }) => sum + count, 0)} 次`}
        >
          <Link href={`/host/${host}`}>查詢 {host} 的詐騙紀錄</Link>
          警政署公告
          <ul>
            {records.map((record) => (
              <li key={record.id}>
                <Link
                  href={`https://165.npa.gov.tw/#/article/9/${record.announcementId}#:~:text=${record.name}`}
                >
                  {record.announcementTitle}
                </Link>{' '}
                （通報 {record.count} 件）
              </li>
            ))}
          </ul>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
