import { NextResponse } from "next/server";
import AnalyticsService from "../../services/analytics";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { pageUrl, userAgent, referrer, sessionId, deviceType } = data;

        // Validate required fields
        if (!pageUrl || !sessionId) {
            return NextResponse.json(
                { error: "Missing required fields: pageUrl, sessionId" },
                { status: 400 }
            );
        }

        const analyticsService = new AnalyticsService();
        const result = await analyticsService.recordPageView({
            pageUrl,
            userAgent: userAgent || "",
            referrer: referrer || "",
            sessionId,
            deviceType: deviceType || "desktop",
        });

        return NextResponse.json({ success: true, id: result._id });
    } catch (error) {
        console.error("Error tracking page view:", error);
        return NextResponse.json(
            { error: "Failed to track page view" },
            { status: 500 }
        );
    }
}
