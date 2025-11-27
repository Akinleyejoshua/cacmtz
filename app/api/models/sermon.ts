import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISermon extends Document {
    title: string;
    minister: string;
    date: Date;
    description: string;
    youtubeLink: string;
    duration: number; // in minutes
    bulletinId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SermonSchema: Schema = new Schema({
    title: { type: String, required: true },
    minister: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    youtubeLink: { type: String, required: true },
    duration: { type: Number, required: true },
    bulletinId: { type: String },
}, {
    timestamps: true
});

const Sermon: Model<ISermon> = mongoose.models.Sermon || mongoose.model<ISermon>('Sermon', SermonSchema);

export default Sermon;
