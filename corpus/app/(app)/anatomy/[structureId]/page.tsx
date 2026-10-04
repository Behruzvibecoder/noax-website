import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STRUCTURES, getStructure } from "@/lib/learning/curriculum";
import { TopBar } from "@/components/layout/TopBar";
import { AnatomyViewer } from "@/components/learning/AnatomyViewer";

interface Props {
  params: Promise<{ structureId: string }>;
}

export function generateStaticParams() {
  return STRUCTURES.map((structure) => ({ structureId: structure.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { structureId } = await params;
  const structure = getStructure(structureId);
  return {
    title: structure ? `${structure.name} — Atlas` : "Atlas",
    description: structure?.summary,
  };
}

export default async function StructurePage({ params }: Props) {
  const { structureId } = await params;
  const structure = getStructure(structureId);
  if (!structure) notFound();

  return (
    <>
      <TopBar title={structure.name} />
      <div className="px-5 py-8 md:px-8 md:py-12">
        <AnatomyViewer structure={structure} />
      </div>
    </>
  );
}
