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

// Indexes for fast category browsing and date sorting
GalleryItemSchema.index({ createdAt: -1 });
GalleryItemSchema.index({ category: 1, createdAt: -1 });

const GalleryItem: Model<IGalleryItem> = mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);

export default GalleryItem;
