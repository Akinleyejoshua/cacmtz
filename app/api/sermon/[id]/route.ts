import SermonService from "../../services/sermon";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const sermonService = new SermonService();
    const result = await sermonService.get_sermon(params.id);
    return NextResponse.json(result);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const sermonService = new SermonService();
    const data = await request.json();
    const result = await sermonService.update_sermon(params.id, data);
    return NextResponse.json(result);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const sermonService = new SermonService();
    const result = await sermonService.delete_sermon(params.id);
    return NextResponse.json(result);
}
