import SermonService from "../../services/sermon";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const sermonService = new SermonService();
    const result = await sermonService.get_latest_sermon();
    return NextResponse.json(result, {
        headers: {
            "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
    });
}
