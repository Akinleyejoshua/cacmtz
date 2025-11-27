import { NextResponse } from "next/server";
import ChurchProfileService from "../services/church-profile";

export async function POST(request: Request) {
    const {data, id} = await request.json()
    // console.log(data.data)
    const churchProfileService = new ChurchProfileService();
    const result = await churchProfileService.update_profile(id, data);
    return NextResponse.json(result);
}