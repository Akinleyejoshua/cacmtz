import GeneralService from "../services/general";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const generalService = new GeneralService();
    const result = await generalService.get_general();
    return NextResponse.json(result, {
        headers: {
            "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
    });
}

export async function POST(request: Request) {
    const generalService = new GeneralService();
    const data = await request.json();
    const result = await generalService.update_general(data);
    return NextResponse.json(result);
}
