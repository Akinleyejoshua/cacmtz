import ChurchProfileService from "../services/church-profile";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {id} = await request.json()
    // console.log(data.data)
    const churchProfileService = new ChurchProfileService();
    const result = await churchProfileService.delete_profile(id);
    return NextResponse.json(result);
}