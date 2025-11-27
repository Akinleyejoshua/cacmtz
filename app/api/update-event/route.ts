import EventService from "../services/event";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {data, id} = await request.json()
    // console.log(data.data)
    const eventService = new EventService();
    const result = await eventService.update_event(id, data);
    return NextResponse.json(result);
}