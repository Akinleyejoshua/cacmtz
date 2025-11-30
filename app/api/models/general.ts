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
        tiktok: string;
        linkedin: string;
        soundCloud: string;
        whatsapp: string;
    };
    contactDetails: {
        phone: string;
        email: string;
        mainLine: string;
        prayerLine: string;
    };
    serviceTime: string;
    officeHours: string;
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
        tiktok: { type: String, required: false, default: '' },
        linkedin: { type: String, required: false, default: '' },
        soundCloud: { type: String, required: false, default: '' },
        whatsapp: { type: String, required: false, default: '' },
        // other fields
        mainLine: { type: String, required: false, default: '' },
        prayerLine: { type: String, required: false, default: '' },
    },
    contactDetails: {
        phone: { type: String, required: false, default: '' },
        email: { type: String, required: false, default: '' },
        mainLine: { type: String, required: false, default: '' },
        prayerLine: { type: String, required: false, default: '' },
    },
    serviceTime: { type: String, required: false, default: '' },
    officeHours: { type: String, required: false, default: '' },
    churchAddress: { type: String, required: false, default: '' },
});

// 3. Create/Retrieve the Mongoose Model
// This check prevents the "OverwriteModelError" in Next.js
const General: Model<IGeneral> = (mongoose.models.General as Model<IGeneral>) || mongoose.model<IGeneral>('General', GeneralSchema);

export default General;