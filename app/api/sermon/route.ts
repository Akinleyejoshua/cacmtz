import SermonService from "../services/sermon";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const sermonService = new SermonService();
    const result = await sermonService.get_sermons();
    return NextResponse.json(result);
}

export async function POST(request: Request) {
    const sermonService = new SermonService();
    const data = await request.json();
    const result = await sermonService.add_sermon(data);
    return NextResponse.json(result);
}
