import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define the TypeScript Interface for your Document
export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
  duration: string;
  liveLink: string;
  isLive: Boolean;
  isAutoLive: Boolean;
  image: string;
  status: string;
  dateTime: string;
  // Recurrence fields
  isRecurring: boolean;
  recurrenceType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceInterval: number;
  recurrenceDays: number[]; // 0-6 for Sunday-Saturday (used for weekly)
  recurrenceEndDate: string;
  recurrenceCount: number;

  // Detailed View Fields
  eventMinisters: Schema.Types.ObjectId[];
  bulletinId: Schema.Types.ObjectId;
  isPublicDetailedView: boolean;
}

// 2. Define the Mongoose Schema
const EventSchema: Schema<IEvent> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  location: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  endTime: { type: String, required: false },
  duration: { type: String, required: true },
  liveLink: { type: String, required: false },
  isLive: { type: Boolean, required: false },
  isAutoLive: { type: Boolean, default: false },
  image: { type: String, required: false },
  dateTime: { type: String, required: false },
  // Recurrence fields
  isRecurring: { type: Boolean, default: false },
  recurrenceType: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], default: 'weekly' },
  recurrenceInterval: { type: Number, default: 1 }, // Every X period
  recurrenceDays: { type: [Number], default: [] }, // For weekly: days of week (0=Sunday, 6=Saturday)
  recurrenceEndDate: { type: String, required: false }, // When recurrence ends
  recurrenceCount: { type: Number, required: false }, // Number of occurrences (alternative to endDate)

  // Detailed View Fields
  eventMinisters: [{ type: Schema.Types.ObjectId, ref: 'Minister' }],
  bulletinId: { type: Schema.Types.ObjectId, ref: 'Bulletin' },
  isPublicDetailedView: { type: Boolean, default: false },
});
// 3. Create/Retrieve the Mongoose Model
// This check prevents the "OverwriteModelError" in Next.js
const Event: Model<IEvent> = (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>('Event', EventSchema);

export default Event;