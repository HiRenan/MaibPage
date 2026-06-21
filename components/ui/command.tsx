'use client';

import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

// Wrapper de tokens sobre cmdk. Comandos em mono, divisores tracejados (daviaviss),
// item ativo marcado pelo Sinal Ember (cor + ícone + glifo ↵, daltônico-safe).
// O vidro/elevação vivem no Dialog que envolve isto (components/command-palette).

function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-sm',
        className,
      )}
      {...props}
    />
  );
}

function CommandInput({ className, ...props }: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="border-border flex items-center gap-2.5 border-b border-dashed px-3">
      <Search aria-hidden className="text-muted-foreground size-4 shrink-0" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          'text-foreground placeholder:text-muted-foreground flex h-12 w-full bg-transparent font-mono text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        'max-h-80 scroll-py-1 [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] overflow-x-hidden overflow-y-auto p-1.5',
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty(props: ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="text-muted-foreground py-8 text-center font-mono text-sm"
      {...props}
    />
  );
}

function CommandGroup({ className, ...props }: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        'text-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.6875rem] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:[color:var(--muted-foreground)] [&_[cmdk-group-heading]]:uppercase',
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn('border-border mx-1 my-1.5 border-t border-dashed', className)}
      {...props}
    />
  );
}

function CommandItem({ className, ...props }: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        'group/item text-muted-foreground relative flex cursor-default items-center gap-2.5 rounded-sm px-2.5 py-2 font-mono text-sm outline-none select-none',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
        'data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground',
        "[&_svg]:text-muted-foreground data-[selected=true]:[&_svg]:text-primary [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

// Hint de ativação ↵: aparece (em ember) só na linha ativa. Sinal extra além da
// cor — reforça o item selecionado por glifo + posição.
function CommandShortcut({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="command-shortcut"
      className={cn(
        'text-muted-foreground group-data-[selected=true]/item:text-primary ml-auto font-mono text-xs opacity-0 group-data-[selected=true]/item:opacity-100',
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
