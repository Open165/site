import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
import Icon from '@/components/Icon';
import logo from './logo64.svg';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="bg-background text-foreground fixed top-0 left-0 right-0 flex align-center gap-2 p-2 border-b-1 lg:border-b-0 z-10 lg:-z-0">
        <h1 className="mr-auto">
          <Tooltip content="回 Open165 首頁">
            <Link href="/">
              <Image width={48} height={48} src={logo} alt="Open 165" />
            </Link>
          </Tooltip>
        </h1>
        <Tooltip content="關於 Open165">
          <Button
            isIconOnly
            radius="full"
            size="lg"
            variant="light"
            as={Link}
            href="/about"
          >
            <Icon name="info" />
          </Button>
        </Tooltip>
      </nav>
      <main className="w-full max-w-screen-md p-4 pt-16 relative z-0">
        {children}
      </main>
      <footer className="w-full max-w-screen-md p-4 border-t-1">
        <Link href="/about">關於 Open165</Link>
      </footer>
    </>
  );
}

export default AppLayout;
