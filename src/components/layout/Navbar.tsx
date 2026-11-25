import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { PROFILE } from '@/features/profile';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const NAV_LINKS = [
  { href: '#about', label: 'Chi sono' },
  { href: '#skills', label: 'Conoscenze' },
  { href: '#gis-studio', label: 'Demo GIS' },
  { href: '#experience', label: 'Esperienze' },
  { href: '#contact', label: 'Contatti' },
];

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#DFDDD5] bg-[#F6F5F0]/90 backdrop-blur-md dark:border-[#232830] dark:bg-[#0B0D0F]/90">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-[#E85D2A] focus:px-3 focus:py-2 focus:text-xs focus:font-semibold focus:text-[#0B0D0F]"
      >
        Vai al contenuto
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#about"
          className="inline-flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight text-[#121417] dark:text-[#F2F1EC]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#E85D2A] text-xs font-bold text-[#0B0D0F]">
            GP
          </span>
          <span>{PROFILE.name}</span>
        </a>

        <nav aria-label="Navigazione principale" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#5A616B] transition hover:text-[#121417] dark:text-[#98A1AE] dark:hover:text-[#F2F1EC]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DFDDD5] text-[#5A616B] transition hover:border-[#E85D2A] hover:text-[#121417] dark:border-[#232830] dark:text-[#98A1AE] dark:hover:text-[#F2F1EC]"
            aria-label="Cambia tema chiaro o scuro"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DFDDD5] text-[#5A616B] md:hidden dark:border-[#232830] dark:text-[#98A1AE]"
            aria-label="Apri menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#DFDDD5] bg-[#F6F5F0] px-5 py-3 md:hidden dark:border-[#232830] dark:bg-[#0B0D0F]">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#121417] hover:bg-[#EAE8E0] dark:text-[#F2F1EC] dark:hover:bg-[#13161A]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
