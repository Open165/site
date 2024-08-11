import type React from 'react';
import { twMerge } from 'tailwind-merge';

export function Heading({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h1'>) {
  return (
    <h1
      className={twMerge(
        'text-display font-serif font-normal my-14 -tracking-[.01em]',
        className
      )}
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
      className={twMerge(
        'text-body font-sans my-6 font-light tracking-wide',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
