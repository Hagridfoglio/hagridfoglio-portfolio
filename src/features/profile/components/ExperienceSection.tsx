import { ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EXPERIENCES, PROFILE } from '@/features/profile/data/profile.data';

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="scroll-mt-20 border-t border-[#DFDDD5] py-24 dark:border-[#232830]"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="03 · Percorso"
          title="Esperienze e formazione"
          description="Quattro anni di sviluppo frontend su prodotti reali: applicazioni web e desktop Electron, monitor touch Raspberry Pi e piattaforme GIS."
        />

        <div className="divide-y divide-[#DFDDD5] border-t border-[#DFDDD5] dark:divide-[#232830] dark:border-[#232830]">
          {EXPERIENCES.map((exp) => (
            <article
              key={exp.id}
              className="grid gap-6 py-8 md:grid-cols-[240px_1fr]"
            >
              <div>
                <p className="font-mono text-xs font-semibold text-[#E85D2A]">{exp.period}</p>
                <p className="mt-1 text-sm font-medium text-[#5A616B] dark:text-[#98A1AE]">
                  {exp.scope}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-xl font-bold tracking-tight text-[#121417] dark:text-[#F2F1EC]">
                    {exp.company}{' '}
                    <span className="font-normal text-[#5A616B] dark:text-[#98A1AE]">
                      — {exp.role}
                    </span>
                  </h3>

                  {exp.hasGisDemo && (
                    <a
                      href="#gis-studio"
                      className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#E85D2A] underline-offset-4 hover:underline"
                    >
                      Prova la demo GIS
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#5A616B] dark:text-[#98A1AE]">
                  {exp.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E85D2A]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[#EAE8E0] px-2.5 py-1 font-mono text-[11px] font-medium text-[#121417] dark:bg-[#161A20] dark:text-[#D5D9E0]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Education & Languages */}
        <div className="mt-8 grid gap-4 border-t border-[#DFDDD5] pt-8 sm:grid-cols-2 dark:border-[#232830]">
          <div className="rounded-xl border border-[#DFDDD5] bg-white p-5 dark:border-[#232830] dark:bg-[#13161A]">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#E85D2A]">
              Formazione
            </p>
            <h3 className="mt-2 text-base font-bold text-[#121417] dark:text-[#F2F1EC]">
              {PROFILE.education.degree}
            </h3>
            <p className="mt-1 text-sm text-[#5A616B] dark:text-[#98A1AE]">
              {PROFILE.education.school} · {PROFILE.education.period}
            </p>
          </div>

          <div className="rounded-xl border border-[#DFDDD5] bg-white p-5 dark:border-[#232830] dark:bg-[#13161A]">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#E85D2A]">
              Lingue
            </p>
            <div className="mt-3 flex flex-wrap gap-6">
              {PROFILE.languages.map((lang) => (
                <div key={lang.name}>
                  <p className="text-sm font-bold text-[#121417] dark:text-[#F2F1EC]">
                    {lang.name}
                  </p>
                  <p className="text-xs text-[#5A616B] dark:text-[#98A1AE]">{lang.level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
