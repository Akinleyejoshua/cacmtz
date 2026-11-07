import Minister, { IMinister } from '../models/minister';
import connectDB from '../db';

/**
 * Normalizes minister document so both legacy `image` (string)
 * and multi-photo `images` (string[]) are always populated and synced.
 */
const normalizeMinister = (m: any) => {
    if (!m) return m;
    const images: string[] = Array.isArray(m.images) && m.images.length > 0
        ? m.images
        : (m.image ? [m.image] : []);
    return {
        ...m,
        image: m.image || (images[0] || ""),
        images,
    };
};

export const getAllMinisters = async (): Promise<any[]> => {
    await connectDB();
    const docs = await Minister.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
    return docs.map(normalizeMinister);
};

export const getMinisterById = async (id: string): Promise<any | null> => {
    await connectDB();
    const doc = await Minister.findById(id).lean();
    return normalizeMinister(doc);
};

export const createMinister = async (data: Partial<IMinister>): Promise<any> => {
    await connectDB();
    const payload = {
        ...data,
        image: (data as any).images?.[0] || data.image || "",
    };
    const created = await Minister.create(payload);
    return normalizeMinister(created.toObject ? created.toObject() : created);
};

export const updateMinister = async (id: string, data: Partial<IMinister>): Promise<any | null> => {
    await connectDB();
    const payload: any = { ...data };
    if ((data as any).images !== undefined) {
        payload.image = (data as any).images[0] || "";
    }
    const updated = await Minister.findByIdAndUpdate(id, payload, { new: true }).lean();
    return normalizeMinister(updated);
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
