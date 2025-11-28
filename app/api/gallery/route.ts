import { NextResponse } from 'next/server';
import { getAllGalleryItems, createGalleryItem } from '../services/gallery';

export async function GET() {
    try {
        const items = await getAllGalleryItems();
        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching gallery items:', error);
        return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, category, imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const newItem = await createGalleryItem({
            title,
            imageUrl, // Base64 string
            category
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Error creating gallery item:', error);
        return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
    }
}
