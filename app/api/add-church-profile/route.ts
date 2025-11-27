import ChurchProfileService from "../services/church-profile";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {data} = await request.json()
    const churchProfileService = new ChurchProfileService();
    const result = await churchProfileService.add_profile(data);
    return NextResponse.json(result);
}