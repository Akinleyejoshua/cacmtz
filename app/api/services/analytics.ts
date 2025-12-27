import dbConnect from "../db";
import Analytics, { IAnalytics } from "../models/analytics";

interface PageViewData {
    pageUrl: string;
    userAgent: string;
    referrer: string;
    sessionId: string;
    deviceType: 'mobile' | 'desktop' | 'tablet';
}

interface TimeSeriesData {
    date: string;
    count: number;
}

interface AnalyticsStats {
    totalViews: number;
    todayViews: number;
    weekViews: number;
    monthViews: number;
    uniqueVisitors: number;
    deviceBreakdown: { mobile: number; desktop: number; tablet: number };
    timeSeries: TimeSeriesData[];
    recentVisits: { timestamp: Date; pageUrl: string; deviceType: string }[];
}

export default class AnalyticsService {

    // Record a new page view
    async recordPageView(data: PageViewData): Promise<IAnalytics> {
        await dbConnect();

        const analytics = new Analytics({
            pageUrl: data.pageUrl,
            timestamp: new Date(),
            userAgent: data.userAgent,
            referrer: data.referrer,
            sessionId: data.sessionId,
            deviceType: data.deviceType,
        });

        await analytics.save();
        return analytics;
    }

    // Get comprehensive analytics stats
    async getStats(days: number = 30): Promise<AnalyticsStats> {
        await dbConnect();

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

        // Run all queries in parallel
        const [
            totalViews,
            todayViews,
            weekViews,
            monthViews,
            uniqueVisitors,
            deviceBreakdown,
            timeSeries,
            recentVisits,
        ] = await Promise.all([
            // Total views all-time
            Analytics.countDocuments({}),

            // Today's views
            Analytics.countDocuments({ timestamp: { $gte: today } }),

            // Last 7 days views
            Analytics.countDocuments({ timestamp: { $gte: weekAgo } }),

            // Last 30 days views
            Analytics.countDocuments({ timestamp: { $gte: monthAgo } }),

            // Unique visitors (by sessionId) in last 30 days
            Analytics.distinct('sessionId', { timestamp: { $gte: monthAgo } }).then(ids => ids.length),

            // Device breakdown in last 30 days
            this.getDeviceBreakdown(monthAgo),

            // Time series data for last 30 days
            this.getTimeSeries(days),

            // Recent 10 visits
            Analytics.find({})
                .sort({ timestamp: -1 })
                .limit(10)
                .select('timestamp pageUrl deviceType')
                .lean(),
        ]);

        return {
            totalViews,
            todayViews,
            weekViews,
            monthViews,
            uniqueVisitors,
            deviceBreakdown,
            timeSeries,
            recentVisits: recentVisits.map(v => ({
                timestamp: v.timestamp,
                pageUrl: v.pageUrl,
                deviceType: v.deviceType,
            })),
        };
    }

    // Get device type breakdown
    private async getDeviceBreakdown(since: Date): Promise<{ mobile: number; desktop: number; tablet: number }> {
        const result = await Analytics.aggregate([
            { $match: { timestamp: { $gte: since } } },
            { $group: { _id: '$deviceType', count: { $sum: 1 } } },
        ]);

        const breakdown = { mobile: 0, desktop: 0, tablet: 0 };
        result.forEach(item => {
            if (item._id in breakdown) {
                breakdown[item._id as keyof typeof breakdown] = item.count;
            }
        });

        return breakdown;
    }

    // Get time series data for charts
    private async getTimeSeries(days: number): Promise<TimeSeriesData[]> {
        const now = new Date();
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        const result = await Analytics.aggregate([
            { $match: { timestamp: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$timestamp' },
                        month: { $month: '$timestamp' },
                        day: { $dayOfMonth: '$timestamp' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        ]);

        // Fill in missing days with 0
        const timeSeries: TimeSeriesData[] = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];

            const found = result.find(r =>
                r._id.year === date.getFullYear() &&
                r._id.month === date.getMonth() + 1 &&
                r._id.day === date.getDate()
            );

            timeSeries.push({
                date: dateStr,
                count: found ? found.count : 0,
            });
        }

        return timeSeries;
    }
}
