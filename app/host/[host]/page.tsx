import { getPrisma } from '@/lib/db'

export const runtime = 'edge';

export default async function Host({params: {host}}: {params: {host: string}}) {
  const prisma = getPrisma();
  const records = await prisma.scamSiteRecord.findMany({where: {host}});

  return (
    <main>
      <h1>{host}</h1>
      {host} is a confirmed scam by 165. It has been reported {records.reduce((sum, record) => sum + record.count, 0)} times.
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
            <th>Count</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.url}</td>
              <td>{record.count}</td>
              <td>{record.startDate}</td>
              <td>{record.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )

}
