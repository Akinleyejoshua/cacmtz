import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISermon extends Document {
    title: string;
    minister: Schema.Types.ObjectId; // Reference to Minister
    date: Date;
    description: string;
    youtubeLink: string;
    duration: number; // in minutes
    bulletinId?: Schema.Types.ObjectId; // Reference to Bulletin
    createdAt: Date;
    updatedAt: Date;
}

const SermonSchema: Schema = new Schema({
    title: { type: String, required: true },
    minister: { type: Schema.Types.ObjectId, ref: 'Minister', required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    youtubeLink: { type: String, required: true },
    duration: { type: Number, required: true },
    bulletinId: { type: Schema.Types.ObjectId, ref: 'Bulletin' },
}, {
    timestamps: true
});

const Sermon: Model<ISermon> = mongoose.models.Sermon || mongoose.model<ISermon>('Sermon', SermonSchema);

export default Sermon;
