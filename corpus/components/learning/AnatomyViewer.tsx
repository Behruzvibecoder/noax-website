"use client";

import Link from "next/link";
import { useState } from "react";
import type { Structure } from "@/lib/types";
import { STRUCTURES, getStructure } from "@/lib/learning/curriculum";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

/**
 * Atlas surface.
 *
 * The stage is deliberately renderer-agnostic: the `cx-stage` panel is the
 * mount point for the 3D viewer (three.js / model-viewer). Layer state and
 * structure selection are owned here and already serialisable, so wiring a
 * real viewer means calling into it from an effect — no layout or state
 * changes required.
 */
export function AnatomyViewer({ structure }: { structure: Structure }) {
  const [isolated, setIsolated] = useState(false);
  const [labels, setLabels] = useState(true);
  const [activeId, setActiveId] = useState(structure.id);

  const active = getStructure(activeId) ?? structure;
  const siblings = STRUCTURES.filter((s) => s.system === active.system);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="cx-stage cx-scanline relative aspect-[4/3] overflow-hidden xl:aspect-auto xl:min-h-[34rem]">
        <div className="relative z-[1] flex h-full flex-col justify-between p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="cx-eyebrow">{active.system}</p>
              <p className="mt-2 font-[var(--font-display)] text-[clamp(2rem,1.4rem+2.4vw,3.75rem)] font-bold leading-none">
                {active.name}
              </p>
              <p className="mt-2 text-[var(--font-size-body)] italic text-[var(--cx-muted)]">
                {active.latin}
              </p>
            </div>

            {active.model ? (
              <Chip tone="accent">Model · {active.model}</Chip>
            ) : (
              <Chip tone="outline">No model</Chip>
            )}
          </div>

          <div
            className={cn(
              "mx-auto grid size-[min(46%,14rem)] place-items-center rounded-full border border-dashed transition-all duration-700 ease-[var(--ease-bounce)]",
              isolated
                ? "border-[var(--color-blush)] bg-[color-mix(in_oklab,var(--color-blush)_14%,transparent)] scale-105"
                : "border-[var(--cx-line)] bg-[color-mix(in_oklab,var(--cx-foreground)_4%,transparent)]",
            )}
          >
            <span className="text-center text-[var(--font-size-smaller)] uppercase tracking-[0.14em] text-[var(--cx-muted)]">
              3D viewer
              <br />
              mount point
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Toggle active={isolated} onClick={() => setIsolated((v) => !v)}>
              Isolate
            </Toggle>
            <Toggle active={labels} onClick={() => setLabels((v) => !v)}>
              Labels
            </Toggle>
            <span className="ml-auto text-[var(--font-size-smaller)] text-[var(--cx-muted)]">
              {labels ? "Labels on" : "Labels off"} · {siblings.length} in system
            </span>
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-4">
        <div className="rounded-[var(--radius-lg)] bg-[var(--cx-canvas-soft)] p-5 shadow-[inset_0_0_0_1px_var(--cx-line)]">
          <p className="cx-eyebrow">Overview</p>
          <p className="mt-3 text-[var(--font-size-body)] text-[var(--cx-muted)]">
            {active.summary}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] bg-[var(--cx-canvas-soft)] p-5 shadow-[inset_0_0_0_1px_var(--cx-line)]">
          <p className="cx-eyebrow">In this system</p>
          <ul className="mt-3 space-y-1">
            {siblings.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  aria-current={s.id === activeId ? "true" : undefined}
                  className={cn(
                    "w-full rounded-[var(--radius-sm)] px-3 py-2 text-left text-[var(--font-size-small)] transition-colors duration-300",
                    s.id === activeId
                      ? "bg-[color-mix(in_oklab,var(--color-blush)_16%,transparent)] text-[var(--color-blush)]"
                      : "text-[var(--cx-muted)] hover:bg-[color-mix(in_oklab,var(--cx-foreground)_6%,transparent)] hover:text-[var(--cx-foreground)]",
                  )}
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {active.related.length > 0 ? (
          <div className="rounded-[var(--radius-lg)] bg-[var(--cx-canvas-soft)] p-5 shadow-[inset_0_0_0_1px_var(--cx-line)]">
            <p className="cx-eyebrow">Related</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {active.related.map((id) => {
                const rel = getStructure(id);
                if (!rel) return null;
                return (
                  <Link
                    key={id}
                    href={`/anatomy/${id}`}
                    className="cx-source transition-transform duration-300 ease-[var(--ease-bounce)] hover:-translate-y-0.5"
                  >
                    {rel.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-4 py-2 text-[var(--font-size-smaller)] font-bold uppercase tracking-[0.1em] transition-[background-color,color,transform] duration-300 ease-[var(--ease-bounce)]",
        active
          ? "bg-[var(--color-blush)] text-[var(--color-ink)]"
          : "bg-[color-mix(in_oklab,var(--cx-foreground)_8%,transparent)] text-[var(--cx-muted)] hover:text-[var(--cx-foreground)]",
      )}
    >
      {children}
    </button>
  );
}
