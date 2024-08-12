import Mitigation from '@/components/Mitigation';

type Props = { params: { name: string } };

export default function MitigationByName({
  params: { name: encodedName },
}: Props) {
  const name = decodeURIComponent(encodedName).trim();

  return (
    <>
      <p>詐騙集團用 {name} 的名義騙了你嗎？請參考以下建議。</p>
      <Mitigation />
    </>
  );
}
