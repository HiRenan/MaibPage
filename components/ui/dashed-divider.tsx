import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export type DashedDividerProps = ComponentProps<'div'> & {
  orientation?: 'horizontal' | 'vertical';
};

// Divisor tracejado — assinatura visual herdada do daviaviss.me.
export function DashedDivider({
  orientation = 'horizontal',
  className,
  ...props
}: DashedDividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'border-border border-dashed',
        orientation === 'horizontal' ? 'my-8 w-full border-t' : 'mx-4 self-stretch border-l',
        className,
      )}
      {...props}
    />
  );
}
