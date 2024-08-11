'use client';

import { usePathname } from 'next/navigation';
import { Tabs, Tab } from '@nextui-org/tabs';

type TabTitleProps = {
  shortLabel: string;
  longLabel: string;
};

const TabTitle = ({ shortLabel, longLabel }: TabTitleProps) => {
  return (
    <>
      <span className="md:hidden">{shortLabel}</span>
      <span className="hidden md:inline">{longLabel}</span>
    </>
  );
};

type Props = {
  /** Currently shown site Name or URL */
  name: string;

  /** Current path */
  basePath: string;
};

/** Content tab list */
export default function ScamTabs({ name, basePath }: Props) {
  const pathname = usePathname();

  return (
    <div>
      <Tabs aria-label="Options" selectedKey={pathname}>
        <Tab
          title={
            <TabTitle
              shortLabel={`它是詐騙嗎`}
              longLabel={`${name} 是詐騙嗎`}
            />
          }
          href={basePath}
        />
        <Tab
          title={
            <TabTitle
              shortLabel={`被騙了怎辦`}
              longLabel={`被 ${name} 騙了怎麼辦`}
            />
          }
          href={`${basePath}/mitigation`}
        />
      </Tabs>
    </div>
  );
}
