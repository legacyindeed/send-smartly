import { AppShell } from "@/components/layout/AppShell";
import { HeroSection } from "@/components/hero/HeroSection";
import { ComparisonWorkspace } from "@/components/layout/ComparisonWorkspace";

export default function ComparePage() {
  return (
    <AppShell>
      <HeroSection />
      <ComparisonWorkspace />
    </AppShell>
  );
}
