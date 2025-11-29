import Bulletin, { IBulletin } from '../models/bulletin';
import connectDB from '../db';

export const getAllBulletins = async (): Promise<IBulletin[]> => {
    await connectDB();
    return await Bulletin.find({}).sort({ date: -1 });
};

export const getBulletinById = async (id: string): Promise<IBulletin | null> => {
    await connectDB();
    return await Bulletin.findById(id);
};

export const createBulletin = async (data: {
    title: string;
    date: Date;
    description?: string;
    file?: string;
    fileName?: string;
}): Promise<IBulletin> => {
    await connectDB();
    return await Bulletin.create(data);
};

export const updateBulletin = async (id: string, data: Partial<IBulletin>): Promise<IBulletin | null> => {
    await connectDB();
    return await Bulletin.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBulletin = async (id: string): Promise<IBulletin | null> => {
    await connectDB();
    return await Bulletin.findByIdAndDelete(id);
};
