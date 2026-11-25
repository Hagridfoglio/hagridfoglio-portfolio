import { PROFILE } from '@/features/profile';

export function Footer() {
  return (
    <footer className="border-t border-[#DFDDD5] py-8 dark:border-[#232830]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs text-[#5A616B] sm:flex-row sm:px-8 dark:text-[#98A1AE]">
        <p>
          © {new Date().getFullYear()} {PROFILE.name} — {PROFILE.role}
        </p>
        <p className="font-mono">React · TypeScript · OpenLayers + rlayers</p>
      </div>
    </footer>
  );
}
