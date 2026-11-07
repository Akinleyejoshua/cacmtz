import { NextResponse } from "next/server";
import { getOutreachPageData } from "../services/outreach";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getOutreachPageData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching outreach page data:", error);
    return NextResponse.json(
      { error: "Failed to fetch outreach page data" },
      { status: 500 }
    );
  }
}
