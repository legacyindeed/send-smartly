import type { ReactNode } from "react";

type Props = { children: ReactNode };

export function AppShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#060b10] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(16,185,129,0.14),transparent_40%),radial-gradient(circle_at_100%_0%,rgba(56,189,248,0.12),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">{children}</div>
    </div>
  );
}
