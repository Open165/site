'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TabProps = {
  href: string;
  shortLabel: string;
  longLabel: string;
};

const Tab = ({ href, shortLabel, longLabel }: TabProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-4 py-2 text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'} hover:text-gray-900`}
      aria-selected={isActive}
    >
      <span className="md:hidden">{shortLabel}</span>
      <span className="hidden md:inline">{longLabel}</span>
    </Link>
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
  return (
    <div className="flex justify-center">
      <Tab
        href={basePath}
        shortLabel={`它是詐騙嗎`}
        longLabel={`${name} 是詐騙嗎`}
      />
      <Tab
        href={`${basePath}/mitigation`}
        shortLabel={`被騙了怎辦`}
        longLabel={`被 ${name} 騙了怎麼辦`}
      />
    </div>
  );
}
