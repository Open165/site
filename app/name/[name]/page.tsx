import Link from 'next/link';
import Highlighted from '@/components/Highlighted';
import { getRecords } from '@/app/name/util';
import { Paragraph } from '@/components/contents';

type Props = { params: { name: string } };

export default async function ReportByName({
  params: { name: encodedName },
}: Props) {
  const name = decodeURIComponent(encodedName).trim();
  const [directHits, ftsHits] = await getRecords(name);

  if (directHits.length === 0 && ftsHits.length === 0) {
    return (
      <>
        <Paragraph>查無名為「{name}」的詐騙網站。</Paragraph>
      </>
    );
  }

  return (
    <>
      {directHits.length > 0 && (
        <>
          <h2 className="text-heading font-serif my-6">
            這些網站都自稱「{name}」
          </h2>
          <Paragraph>
            以下是內政部警政署 165 的開放資料所公布，使用「{name}
            」名義的詐騙網站，以及收到回報的次數。
          </Paragraph>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Count</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>165</th>
              </tr>
            </thead>
            <tbody>
              {directHits.map((record) => (
                <tr key={record.id}>
                  <td>{record.name}</td>
                  <td>
                    <Link href={`/host/${record.host}`}>{record.url}</Link>
                  </td>
                  <td>{record.count}</td>
                  <td>{record.startDate}</td>
                  <td>{record.endDate}</td>
                  <td>
                    <Link
                      href={`https://165.npa.gov.tw/#/article/9/${record.announcementId}#:~:text=${record.name}`}
                    >
                      {record.announcementTitle}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {ftsHits.length > 0 && (
        <>
          <Paragraph>
            以下是網站名稱或網址與「{name}」相似的詐騙網站紀錄，供您參考。
          </Paragraph>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>網域</th>
                <th>Reported</th>
              </tr>
            </thead>
            <tbody>
              {ftsHits.map((record) => (
                <tr key={record.rowid}>
                  <td>
                    <Link href={`/name/${record.nameTokens.join('')}`}>
                      <Highlighted tokens={record.nameTokens} />
                    </Link>
                  </td>
                  <td>
                    <Link href={`/host/${record.hostTokens.join('')}`}>
                      <Highlighted tokens={record.hostTokens} />
                    </Link>
                  </td>
                  <td>
                    {record.count} time(s) during {record.startDate} and{' '}
                    {record.endDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
