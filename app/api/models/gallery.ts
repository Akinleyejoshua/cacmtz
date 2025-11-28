import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryItem extends Document {
    title: string;
    imageUrl: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
}

const GalleryItemSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        imageUrl: { type: String, required: true },
        category: { type: String },
    },
    {
        timestamps: true,
    }
);

const GalleryItem: Model<IGalleryItem> = mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);

export default GalleryItem;
