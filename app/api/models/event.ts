import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define the TypeScript Interface for your Document
export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  createdAt: Date;
  updatedAt: Date;
  duration: string;
  liveLink: string;
  isLive: Boolean;
  image: string;
  status: string;
  dateTime: string;
}

// 2. Define the Mongoose Schema
const EventSchema: Schema<IEvent> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    liveLink: { type: String, required: false },
    isLive: { type: Boolean, required: false },
    image: { type: String, required: false },
    dateTime: { type: String, required: false },
}); 
// 3. Create/Retrieve the Mongoose Model
// This check prevents the "OverwriteModelError" in Next.js
const Event: Model<IEvent> = (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>('Event', EventSchema);

export default Event;