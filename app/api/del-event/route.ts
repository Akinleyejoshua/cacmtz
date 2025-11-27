import EventService from "../services/event";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {id} = await request.json()
    // console.log(data.data)
    const eventService = new EventService();
    const result = await eventService.delete_event(id);
    return NextResponse.json(result);
}