import { NextResponse } from 'next/server';
import { getBulletinById, updateBulletin, deleteBulletin } from '../../services/bulletin';

export async function GET(request: Request, { params }: any) {
    const { id } = await params;
    try {
        const bulletin = await getBulletinById(id);
        if (!bulletin) {
            return NextResponse.json({ error: 'Bulletin not found' }, { status: 404 });
        }
        return NextResponse.json(bulletin);
    } catch (error) {
        console.error('Error fetching bulletin:', error);
        return NextResponse.json({ error: 'Failed to fetch bulletin' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: any) {
    const { id } = await params;
    try {
        const body = await request.json();
        const updatedBulletin = await updateBulletin(id, body);
        if (!updatedBulletin) {
            return NextResponse.json({ error: 'Bulletin not found' }, { status: 404 });
        }
        return NextResponse.json(updatedBulletin);
    } catch (error) {
        console.error('Error updating bulletin:', error);
        return NextResponse.json({ error: 'Failed to update bulletin' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: any) {
    const { id } = await params;
    try {
        const deletedBulletin = await deleteBulletin(id);
        if (!deletedBulletin) {
            return NextResponse.json({ error: 'Bulletin not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Bulletin deleted successfully' });
    } catch (error) {
        console.error('Error deleting bulletin:', error);
        return NextResponse.json({ error: 'Failed to delete bulletin' }, { status: 500 });
    }
}
