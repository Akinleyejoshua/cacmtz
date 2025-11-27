import EventService from "../services/event";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const eventService = new EventService();
    const result = await eventService.get_events();
    return NextResponse.json(result);
}