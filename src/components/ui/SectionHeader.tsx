interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-2.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-[#E85D2A]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-[#121417] sm:text-4xl dark:text-[#F2F1EC]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-[#5A616B] dark:text-[#98A1AE]">
          {description}
        </p>
      )}
    </div>
  );
}
