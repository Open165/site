'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Link as NextUILink } from '@nextui-org/link';
import { Accordion, AccordionItem } from '@nextui-org/accordion';

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
          <Link href={`/host/${host}`} passHref legacyBehavior>
            <NextUILink>查詢 {host} 的詐騙紀錄與類似網域</NextUILink>
          </Link>
          <h2 className="mt-2">
            警政署針對 {records[0].name} - {host} 的公告
          </h2>
          <ul>
            {records.map((record) => (
              <li key={record.id}>
                <NextUILink
                  isExternal
                  showAnchorIcon
                  href={`https://165.npa.gov.tw/#/article/9/${record.announcementId}#:~:text=${record.name}`}
                >
                  {record.announcementTitle}（通報 {record.count} 件）
                </NextUILink>{' '}
              </li>
            ))}
          </ul>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
