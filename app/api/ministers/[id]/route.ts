import { NextResponse } from 'next/server';
import { getMinisterById, updateMinister, deleteMinister } from '../../services/minister';

export async function GET(request: Request, { params }:any) {
    const {id} = await params;
    try {
        const minister = await getMinisterById(id);
        if (!minister) {
            return NextResponse.json({ error: 'Minister not found' }, { status: 404 });
        }
        return NextResponse.json(minister);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch minister' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: any) {
    const {id} = await params;

    try {
        const body = await request.json();
        const minister = await updateMinister(id, body);
        if (!minister) {
            return NextResponse.json({ error: 'Minister not found' }, { status: 404 });
        }
        return NextResponse.json(minister);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update minister' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: any) {
    const {id} = await params;

    try {
        const minister = await deleteMinister(id);
        if (!minister) {
            return NextResponse.json({ error: 'Minister not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Minister deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete minister' }, { status: 500 });
    }
}
