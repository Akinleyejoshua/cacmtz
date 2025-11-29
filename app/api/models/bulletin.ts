import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBulletin extends Document {
    title: string;
    date: Date;
    description?: string;
    file?: string;
    fileName?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BulletinSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        description: { type: String },
        file: { type: String },
        fileName: { type: String },
    },
    {
        timestamps: true,
    }
);

const Bulletin: Model<IBulletin> =
    mongoose.models.Bulletin || mongoose.model<IBulletin>('Bulletin', BulletinSchema);

export default Bulletin;
