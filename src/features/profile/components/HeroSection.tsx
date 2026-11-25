import { ArrowDownRight, Map } from 'lucide-react';
import { PROFILE } from '@/features/profile/data/profile.data';

export function HeroSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden pt-20 pb-16"
    >
      <div className="carto-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_45%,transparent_82%)]" />

      <div className="hero-enter relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-[#5A616B] dark:text-[#98A1AE]">
            <span className="h-2 w-2 rounded-full bg-[#16A36E]" />
            <span>{PROFILE.role}</span>
            <span aria-hidden="true">·</span>
            <span>{PROFILE.location}</span>
          </div>

          <h1 className="text-4xl font-bold leading-[1.06] tracking-tight text-[#121417] sm:text-6xl lg:text-7xl dark:text-[#F2F1EC]">
            {PROFILE.name}.{' '}
            <span className="text-[#5A616B] dark:text-[#98A1AE]">
              Interfacce web, desktop Electron e mappe GIS.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-[#5A616B] sm:text-lg dark:text-[#98A1AE]">
            {PROFILE.bio}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#gis-studio"
              className="inline-flex min-h-[46px] items-center gap-2.5 rounded-lg bg-[#E85D2A] px-5 py-3 text-sm font-semibold text-[#0B0D0F] transition hover:bg-[#F26C3A] active:scale-[0.98]"
            >
              <Map className="h-4 w-4" />
              Apri Workstation GIS
            </a>
            <a
              href="#experience"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-[#DFDDD5] bg-white px-5 py-3 text-sm font-semibold text-[#121417] transition hover:-translate-y-0.5 hover:border-[#121417] active:scale-[0.98] dark:border-[#232830] dark:bg-[#13161A] dark:text-[#F2F1EC] dark:hover:border-[#F2F1EC]"
            >
              Vedi Esperienze
              <ArrowDownRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Hard facts strip — aligned strictly to left and right edges */}
        <div className="mt-16 grid grid-cols-1 gap-6 border-t border-[#DFDDD5] pt-7 sm:grid-cols-3 dark:border-[#232830]">
          {PROFILE.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#5A616B] dark:text-[#98A1AE]">
                {stat.label}
              </p>
              <p className="mt-1.5 text-xl font-bold tracking-tight text-[#121417] dark:text-[#F2F1EC]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
