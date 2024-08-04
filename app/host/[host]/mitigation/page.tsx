import Mitigation from '@/components/Mitigation';

type Props = {params: {host: string}};

export default function MitigationByHost({
  params: {host},
}: Props) {

  return <>
    <p>被 {host} 騙了嗎？請參考以下建議。</p>
    <Mitigation />
  </>;
}
