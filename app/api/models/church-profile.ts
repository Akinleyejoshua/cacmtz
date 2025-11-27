import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define the TypeScript Interface for your Document
export interface IChurchProfile extends Document {
  title: string;
  description: String,
  content: String,
}

// 2. Define the Mongoose Schema
const EventSchema: Schema<IChurchProfile> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  content: { type: String, required: true },

});
// 3. Create/Retrieve the Mongoose Model
// This check prevents the "OverwriteModelError" in Next.js
const ChurchProfile: Model<IChurchProfile> = (mongoose.models.ChurchProfile as Model<IChurchProfile>) || mongoose.model<IChurchProfile>('ChurchProfile', EventSchema);
export default ChurchProfile;