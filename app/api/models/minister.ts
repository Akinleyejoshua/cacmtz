import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMinister extends Document {
    name: string;
    position: string;
    department: string;
    email?: string;
    phone?: string;
    bio?: string;
    image?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const MinisterSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        position: { type: String, required: true },
        department: { type: String, required: true },
        email: { type: String },
        phone: { type: String },
        bio: { type: String },
        image: { type: String },
        socialLinks: {
            facebook: { type: String },
            twitter: { type: String },
            instagram: { type: String },
            linkedin: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

const Minister: Model<IMinister> =
    mongoose.models.Minister || mongoose.model<IMinister>('Minister', MinisterSchema);

export default Minister;
