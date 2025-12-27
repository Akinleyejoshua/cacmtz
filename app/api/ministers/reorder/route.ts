import { NextResponse } from 'next/server';
import { reorderMinisters } from '../../services/minister';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orders } = body;

        if (!orders || !Array.isArray(orders)) {
            return NextResponse.json(
                { error: 'Orders array is required' },
                { status: 400 }
            );
        }

        await reorderMinisters(orders);
        return NextResponse.json({ message: 'Ministers reordered successfully' });
    } catch (error) {
        console.error('Failed to reorder ministers:', error);
        return NextResponse.json(
            { error: 'Failed to reorder ministers' },
            { status: 500 }
        );
    }
}
