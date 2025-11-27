import SermonService from "../../services/sermon";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: any) {
    const {id} = await params;

    const sermonService = new SermonService();
    const result = await sermonService.get_sermon(id);
    return NextResponse.json(result);
}

export async function PUT(request: Request, { params }: any) {
    const {id} = await params;

    const sermonService = new SermonService();
    const data = await request.json();
    const result = await sermonService.update_sermon(id, data);
    return NextResponse.json(result);
}

export async function DELETE(request: Request, { params }: any) {
    const {id} = await params;

    const sermonService = new SermonService();
    const result = await sermonService.delete_sermon(id);
    return NextResponse.json(result);
}
