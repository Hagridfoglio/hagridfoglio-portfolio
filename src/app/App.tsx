import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  ContactSection,
  ExperienceSection,
  HeroSection,
  SkillsSection,
} from '@/features/profile';
import { GisStudioSection } from '@/features/gis-studio';
import { useTheme } from '@/hooks/useTheme';

export function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#121417] transition-colors dark:bg-[#0B0D0F] dark:text-[#F2F1EC]">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content">
        <HeroSection />
        <SkillsSection />
        <GisStudioSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
