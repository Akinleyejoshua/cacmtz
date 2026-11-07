import { NextResponse } from 'next/server';
import { getAllMinisters, createMinister } from '../services/minister';

export async function GET() {
    try {
        const ministers = await getAllMinisters();
        return NextResponse.json(ministers, {
            headers: {
                "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch ministers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const minister = await createMinister(body);
        return NextResponse.json(minister, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to create minister' }, { status: 500 });
    }
}
