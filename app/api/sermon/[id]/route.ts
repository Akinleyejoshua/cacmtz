import SermonService from "../../services/sermon";
import { NextResponse } from "next/server";

<<<<<<< HEAD
export async function GET(request: Request, { params }: any) {
=======
export async function GET(request: Request, { params }: any ) {
>>>>>>> a6d4456e7540aa6928da19d16a06aa79ce1685df
    const sermonService = new SermonService();
    const result = await sermonService.get_sermon(params.id);
    return NextResponse.json(result);
}

<<<<<<< HEAD
export async function PUT(request: Request, { params }: any) {
=======
export async function PUT(request: Request, { params }: any ) {
>>>>>>> a6d4456e7540aa6928da19d16a06aa79ce1685df
    const sermonService = new SermonService();
    const data = await request.json();
    const result = await sermonService.update_sermon(params.id, data);
    return NextResponse.json(result);
}

export async function DELETE(request: Request, { params }: any) {
    const sermonService = new SermonService();
    const result = await sermonService.delete_sermon(params.id);
    return NextResponse.json(result);
}
