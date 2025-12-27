import Minister, { IMinister } from '../models/minister';
import connectDB from '../db';

export const getAllMinisters = async (): Promise<IMinister[]> => {
    await connectDB();
    return await Minister.find({}).sort({ displayOrder: 1, createdAt: -1 });
};

export const getMinisterById = async (id: string): Promise<IMinister | null> => {
    await connectDB();
    return await Minister.findById(id);
};

export const createMinister = async (data: Partial<IMinister>): Promise<IMinister> => {
    await connectDB();
    return await Minister.create(data);
};

export const updateMinister = async (id: string, data: Partial<IMinister>): Promise<IMinister | null> => {
    await connectDB();
    return await Minister.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMinister = async (id: string): Promise<IMinister | null> => {
    await connectDB();
    return await Minister.findByIdAndDelete(id);
};

export const reorderMinisters = async (orders: { id: string; displayOrder: number }[]): Promise<void> => {
    await connectDB();
    const bulkOps = orders.map(({ id, displayOrder }) => ({
        updateOne: {
            filter: { _id: id },
            update: { $set: { displayOrder } },
        },
    }));
    await Minister.bulkWrite(bulkOps);
};
