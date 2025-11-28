import { NextResponse } from 'next/server';
import { deleteGalleryItem, updateGalleryItem } from '../../services/gallery';
import GalleryItem from '../../models/gallery';

export async function DELETE(
    request: Request,
    { params }: any
) {
    try {
        const deletedItem = await deleteGalleryItem(params.id);
        if (!deletedItem) {
            return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: any
) {
    try {
        const body = await request.json();
        const { title, category, imageUrl } = body;

        const updateData: any = { title, category };
        if (imageUrl) {
            updateData.imageUrl = imageUrl;
        }

        const updatedItem = await updateGalleryItem(params.id, updateData);
        if (!updatedItem) {
            return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
        }
        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error('Error updating gallery item:', error);
        return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
    }
}
