/**
 * Collection of components for the contents
 */

import type React from 'react';
import { twMerge } from 'tailwind-merge';

export function Heading({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h1'>) {
  return (
    <h1
      className={twMerge('text-display font-serif my-14', className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function Paragraph({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={twMerge('my-6 font-light tracking-wide', className)}
      {...props}
    >
      {children}
    </p>
  );
}
