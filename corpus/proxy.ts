import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Refreshes the Supabase session cookie on every request and gates the
 * learning routes. Runs on the Edge runtime, so it only touches cookies and
 * headers — never the database.
 *
 * Next 16 renamed the `middleware` convention to `proxy`; the exported
 * function name must match the file name.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image files. API routes are matched
     * so the session is refreshed for them too; the auth routes opt out below.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
