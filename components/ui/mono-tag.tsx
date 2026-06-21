import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

const monoTagVariants = cva(
  'inline-flex items-center rounded-sm border border-border bg-muted font-mono leading-none text-foreground',
  {
    variants: {
      size: {
        sm: 'h-6 px-2 text-xs',
        md: 'h-7 px-2.5 text-sm',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
);

export type MonoTagProps = ComponentProps<'span'> & VariantProps<typeof monoTagVariants>;

// Chip monospace pra tech/metadados (skills, post tags).
export function MonoTag({ className, size, ...props }: MonoTagProps) {
  return <span className={cn(monoTagVariants({ size }), className)} {...props} />;
}
