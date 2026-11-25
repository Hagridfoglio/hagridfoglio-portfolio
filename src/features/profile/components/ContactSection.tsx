import { useState } from 'react';
import { Check, Copy, Github, Mail, MapPin } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PROFILE } from '@/features/profile/data/profile.data';

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(PROFILE.email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-[#DFDDD5] py-24 dark:border-[#232830]"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="04 · Contatti"
          title="Scrivimi"
          description="Per collaborazioni, progetti web, applicazioni Electron o interfacce cartografiche."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col justify-between rounded-xl border border-[#DFDDD5] bg-white p-5 transition hover:-translate-y-0.5 dark:border-[#232830] dark:bg-[#13161A]">
            <div>
              <Mail className="h-4 w-4 text-[#E85D2A]" />
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[#5A616B] dark:text-[#98A1AE]">
                Email
              </p>
              <a
                href={`mailto:${PROFILE.email}`}
                className="mt-1 block break-all text-sm font-semibold text-[#121417] hover:text-[#E85D2A] dark:text-[#F2F1EC]"
              >
                {PROFILE.email}
              </a>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="mt-4 inline-flex min-h-[36px] w-fit items-center gap-1.5 rounded-md border border-[#DFDDD5] px-2.5 py-1 text-xs font-medium text-[#121417] transition hover:border-[#E85D2A] dark:border-[#232830] dark:text-[#F2F1EC]"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-[#16A36E]" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? 'Copiata' : 'Copia email'}
            </button>
          </div>

          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[#DFDDD5] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#E85D2A] dark:border-[#232830] dark:bg-[#13161A]"
          >
            <Github className="h-4 w-4 text-[#E85D2A]" />
            <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[#5A616B] dark:text-[#98A1AE]">
              GitHub
            </p>
            <p className="mt-1 text-sm font-semibold text-[#121417] dark:text-[#F2F1EC]">
              {PROFILE.githubHandle}
            </p>
          </a>

          <div className="rounded-xl border border-[#DFDDD5] bg-white p-5 dark:border-[#232830] dark:bg-[#13161A]">
            <MapPin className="h-4 w-4 text-[#E85D2A]" />
            <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[#5A616B] dark:text-[#98A1AE]">
              Località
            </p>
            <p className="mt-1 text-sm font-semibold text-[#121417] dark:text-[#F2F1EC]">
              {PROFILE.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
