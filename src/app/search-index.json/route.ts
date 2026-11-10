import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/content";

export async function GET() {
  return NextResponse.json(getSearchIndex());
}
