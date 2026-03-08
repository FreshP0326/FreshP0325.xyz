import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/content";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(getSearchIndex(), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
