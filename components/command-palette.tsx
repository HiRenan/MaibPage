'use client';

import { Briefcase, FileText, Home, Languages, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { type RefObject, useState } from 'react';
import { Dialog } from 'radix-ui';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

const navItems = [
  { href: '/', key: 'home', Icon: Home },
  { href: '/about', key: 'about', Icon: User },
  { href: '/experience', key: 'experience', Icon: Briefcase },
  { href: '/blog', key: 'blog', Icon: FileText },
] as const;

// O componente-assinatura e o único vidro do sistema: slab frosted matte
// (metáfora Spotlight/Raycast) sobre um scrim quente que escurece a página.
// Vidro = --popover translúcido + backdrop-blur; NUNCA luz colorida atrás (= neon).
// Entrada coreografada (ease-out-expo) via globals.css; reduced-motion zera lá.
export function CommandPalette({ open, onOpenChange, triggerRef }: CommandPaletteProps) {
  const t = useTranslations('command');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [search, setSearch] = useState('');

  const other = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  const switchLabel = tCommon('switchLanguage', { target: other.toUpperCase() });

  // Reset da busca ao fechar: a paleta abre sempre limpa, nunca com o último termo.
  function handleOpenChange(next: boolean) {
    if (!next) setSearch('');
    onOpenChange(next);
  }

  // Fecha antes de agir: a paleta não fica pendurada sobre a navegação.
  function run(action: () => void) {
    handleOpenChange(false);
    action();
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-background/60 fixed inset-0 z-50 backdrop-blur-sm data-[state=closed]:animate-[cmdk-overlay-out_120ms_ease-out] data-[state=open]:animate-[cmdk-overlay-in_160ms_var(--ease-out-expo)]" />
        <Dialog.Content
          aria-label={t('title')}
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            // Devolve o foco ao trigger (a11y): Radix não restaura sozinho porque
            // a abertura é por estado manual, não por Dialog.Trigger.
            event.preventDefault();
            triggerRef?.current?.focus();
          }}
          className="border-border bg-popover/80 fixed inset-x-4 top-[15vh] z-50 mx-auto max-w-xl origin-top overflow-hidden rounded-sm border shadow-2xl shadow-black/40 backdrop-blur-xl outline-none data-[state=closed]:animate-[cmdk-panel-out_140ms_ease-out] data-[state=open]:animate-[cmdk-panel-in_240ms_var(--ease-out-expo)]"
        >
          <Dialog.Title className="sr-only">{t('title')}</Dialog.Title>
          <Command loop className="bg-transparent">
            <CommandInput placeholder={t('placeholder')} value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>{t('empty')}</CommandEmpty>

              <CommandGroup heading={t('group.navigation')}>
                {navItems.map(({ href, key, Icon }) => (
                  <CommandItem
                    key={href}
                    value={tNav(key)}
                    onSelect={() => run(() => router.push(href))}
                  >
                    <Icon aria-hidden />
                    <span>{tNav(key)}</span>
                    <CommandShortcut>↵</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading={t('group.settings')}>
                <CommandItem
                  value={switchLabel}
                  onSelect={() => run(() => router.replace(pathname, { locale: other }))}
                >
                  <Languages aria-hidden />
                  <span>{switchLabel}</span>
                  <CommandShortcut>↵</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              {/* Estado vazio honesto: o indexador real de posts chega na F6 (MDX). */}
              {search.trim() === '' && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading={t('group.posts')}>
                    <p className="text-muted-foreground px-2.5 py-2 font-mono text-sm">
                      {t('noPosts')}
                    </p>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
