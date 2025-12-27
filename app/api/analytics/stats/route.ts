import { NextResponse } from "next/server";
import AnalyticsService from "../../services/analytics";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get("days") || "30");

        const analyticsService = new AnalyticsService();
        const stats = await analyticsService.getStats(days);

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching analytics stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics stats" },
            { status: 500 }
        );
    }
}
