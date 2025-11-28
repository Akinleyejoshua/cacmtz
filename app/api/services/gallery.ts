import GalleryItem, { IGalleryItem } from '../models/gallery';
import dbConnect from "../db";

export const getAllGalleryItems = async (): Promise<IGalleryItem[]> => {
    await dbConnect();
    return await GalleryItem.find().sort({ createdAt: -1 }).exec();
};

export const createGalleryItem = async (data: Partial<IGalleryItem>): Promise<IGalleryItem> => {
    await dbConnect();
    const newItem = new GalleryItem(data);
    return await newItem.save();
};

export const updateGalleryItem = async (id: string, data: Partial<IGalleryItem>): Promise<IGalleryItem | null> => {
    await dbConnect();
    return await GalleryItem.findByIdAndUpdate(id, data, { new: true });
};

export const deleteGalleryItem = async (id: string): Promise<IGalleryItem | null> => {
    await dbConnect();
    return await GalleryItem.findByIdAndDelete(id);
};
