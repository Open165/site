'use client';

import type React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

/**
 * NextUI with routing setup
 * @ref https://nextui.org/docs/guide/routing#nextjs
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;
}
