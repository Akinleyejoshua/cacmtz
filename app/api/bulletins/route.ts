import { NextResponse } from 'next/server';
import { getAllBulletins, createBulletin } from '../services/bulletin';

export async function GET() {
    try {
        const bulletins = await getAllBulletins();
        return NextResponse.json(bulletins);
    } catch (error) {
        console.error('Error fetching bulletins:', error);
        return NextResponse.json({ error: 'Failed to fetch bulletins' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, date, description, file, fileName } = body;

        if (!title || !date) {
            return NextResponse.json({ error: 'Title and Date are required' }, { status: 400 });
        }

        const newBulletin = await createBulletin({
            title,
            date: new Date(date),
            description,
            file,
            fileName,
        });

        return NextResponse.json(newBulletin, { status: 201 });
    } catch (error) {
        console.error('Error creating bulletin:', error);
        return NextResponse.json({ error: 'Failed to create bulletin' }, { status: 500 });
    }
}
