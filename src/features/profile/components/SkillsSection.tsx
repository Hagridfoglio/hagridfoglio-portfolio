import { SectionHeader } from '@/components/ui/SectionHeader';
import { SKILL_GROUPS } from '@/features/profile/data/profile.data';

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="scroll-mt-20 border-t border-[#DFDDD5] py-24 dark:border-[#232830]"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="01 · Conoscenze"
          title="Stack tecnico e strumenti"
          description="Tecnologie usate in produzione tra applicazioni web, desktop Electron, cartografia OpenLayers, real-time e integrazioni per la gestione degli accessi."
        />

        <div className="divide-y divide-[#DFDDD5] border-y border-[#DFDDD5] dark:divide-[#232830] dark:border-[#232830]">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.id}
              className="grid gap-3 py-5 sm:grid-cols-[240px_1fr] sm:items-center"
            >
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#5A616B] dark:text-[#98A1AE]">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-[#DFDDD5] bg-white px-3 py-1.5 font-mono text-xs font-medium text-[#121417] transition hover:-translate-y-0.5 hover:border-[#E85D2A] dark:border-[#232830] dark:bg-[#13161A] dark:text-[#F2F1EC]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
