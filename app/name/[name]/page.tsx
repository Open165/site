import { getPrisma } from '@/lib/db'

export const runtime = 'edge';

export default async function Name({params: {name: encodedName}}: {params: {name: string}}) {
  const prisma = getPrisma();
  const name = decodeURIComponent(encodedName);
  const records = await prisma.scamSiteRecord.findMany({where: {name}});

  return (
    <main>
      <h1>{name}</h1>
      The name “{name}” is used by the following know scam sites.

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
