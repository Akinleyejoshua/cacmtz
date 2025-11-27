import ChurchProfile from "../services/church-profile";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const churchProfileService = new ChurchProfile();
    const result = await churchProfileService.get_profiles();
    return NextResponse.json(result);
}