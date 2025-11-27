import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define the TypeScript Interface for your Document
export interface IGeneral extends Document {
    marqueeAlert: string;
    watchword: string;
    latestEvent: mongoose.Types.ObjectId;
    socialHandles: {
        facebook: string;
        twitter: string;
        instagram: string;
        youtube: string;
    };
    churchAddress: string;
}

// 2. Define the Mongoose Schema
const GeneralSchema: Schema<IGeneral> = new Schema({
    marqueeAlert: { type: String, required: false, default: '' },
    watchword: { type: String, required: false, default: '' },
    latestEvent: { type: Schema.Types.ObjectId, ref: 'Event', required: false },
    socialHandles: {
        facebook: { type: String, required: false, default: '' },
        twitter: { type: String, required: false, default: '' },
        instagram: { type: String, required: false, default: '' },
        youtube: { type: String, required: false, default: '' },
    },
    churchAddress: { type: String, required: false, default: '' },
});

// 3. Create/Retrieve the Mongoose Model
// This check prevents the "OverwriteModelError" in Next.js
const General: Model<IGeneral> = (mongoose.models.General as Model<IGeneral>) || mongoose.model<IGeneral>('General', GeneralSchema);

export default General;