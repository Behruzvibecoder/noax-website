import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { DashboardShell } from "@/components/learning/DashboardShell";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <TopBar action={{ href: "/tutor", label: "Ask the tutor" }} />
      <DashboardShell />
    </>
  );
}
