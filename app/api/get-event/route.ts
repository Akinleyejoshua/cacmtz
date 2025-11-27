import EventService from "../services/event";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {id} = await request.json();
    const eventService = new EventService();
    const result = await eventService.get_event(id);
    return NextResponse.json(result);
}