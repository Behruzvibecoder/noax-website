import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";

/**
 * Learning shell. The rail is fixed on desktop and becomes a horizontal
 * scroller on mobile so lesson content always keeps the full width.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="surface-stage flex min-h-screen flex-col bg-[var(--cx-canvas)] text-[var(--cx-foreground)] lg:flex-row">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
