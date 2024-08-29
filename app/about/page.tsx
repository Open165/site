import { Heading, Paragraph } from '@/components/contents';
import Icon from '@/components/Icon';
import { Link } from '@nextui-org/link';

function AboutPage() {
  return (
    <>
      <Heading>關於 Open165</Heading>
      <Paragraph>
        Open165
        反詐筆記是民間自主架設的網站，使用內政部警政署公告的開放資料等公開來源情報（OSI），
        讓已經接觸到詐騙或已經被詐騙的民眾，能搜尋到相關資訊，避免被二次詐騙。
      </Paragraph>
      <Paragraph>
        本專案曾在公民科技社群 g0v 之黑客松提案，專案介紹請見
        <Link
          href="https://g0v.hackmd.io/@mrorz/open165-proposal"
          isExternal
          showAnchorIcon
          anchorIcon={<Icon className="px-1" name="open_in_new" opsz={20} />}
        >
          https://g0v.hackmd.io/@mrorz/open165-proposal
        </Link>
      </Paragraph>
      <Paragraph>
        Open165 使用之內政部警政署公告資料「
        <Link href="https://data.gov.tw/dataset/78432" isExternal>
          165反詐騙諮詢專線_假投資(博弈)網站
        </Link>
        」取自政府資料開放平臺，該資料由警政署提供，採
        <Link href="https://data.gov.tw/license" isExternal>
          政府資料開放授權條款-第1版
        </Link>
        釋出。
      </Paragraph>
    </>
  );
}

export default AboutPage;
