import EventService from "../services/event";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json()
    // console.log(data.data)
    const eventService = new EventService();
    const result = await eventService.add_event(data.data);
    return NextResponse.json(result);
}