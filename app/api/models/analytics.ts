import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for page view analytics
export interface IAnalytics extends Document {
    pageUrl: string;
    timestamp: Date;
    userAgent: string;
    referrer: string;
    sessionId: string;
    deviceType: 'mobile' | 'desktop' | 'tablet';
    country?: string;
    city?: string;
}

// Mongoose schema for analytics
const AnalyticsSchema: Schema<IAnalytics> = new Schema({
    pageUrl: { type: String, required: true, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    userAgent: { type: String, required: false },
    referrer: { type: String, required: false },
    sessionId: { type: String, required: true, index: true },
    deviceType: { type: String, enum: ['mobile', 'desktop', 'tablet'], default: 'desktop' },
    country: { type: String, required: false },
    city: { type: String, required: false },
});

// Create compound index for efficient time-series queries
AnalyticsSchema.index({ pageUrl: 1, timestamp: -1 });
AnalyticsSchema.index({ timestamp: -1 });

const Analytics: Model<IAnalytics> =
    (mongoose.models.Analytics as Model<IAnalytics>) ||
    mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export default Analytics;
