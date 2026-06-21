import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

const containerVariants = cva('mx-auto w-full px-6 sm:px-8', {
  variants: {
    size: {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      prose: 'max-w-[70ch]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type ContainerProps = ComponentProps<'div'> & VariantProps<typeof containerVariants>;

export function Container({ className, size, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />;
}
