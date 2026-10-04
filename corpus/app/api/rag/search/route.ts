import { NextResponse } from "next/server";
import { retrieve } from "@/lib/rag/retrieve";

export const runtime = "nodejs";

/** Read-only retrieval endpoint — powers typeahead and the atlas search box. */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ query, results: [] });
  }

  const topK = Number(new URL(request.url).searchParams.get("k") ?? 4);
  const results = await retrieve(query, Number.isFinite(topK) ? topK : 4);

  return NextResponse.json(
    { query, results },
    { headers: { "Cache-Control": "public, max-age=60" } },
  );
}
