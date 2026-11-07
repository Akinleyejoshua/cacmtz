import mongoose from "mongoose";
import Event from "../models/event";
import "../models/minister";
import "../models/bulletin";
import dbConnect from "../db";

class EventService {
    private cleanup_data(data: any) {
        if (data.bulletinId === "") delete data.bulletinId;
        if (Array.isArray(data.eventMinisters)) {
            data.eventMinisters = data.eventMinisters.filter((id: any) => id !== "");
        }
        return data;
    }

    add_event = async (data: any) => {
        await dbConnect();
        const cleanedData = this.cleanup_data(data);
        if (await Event.create(cleanedData)) return "created";
        return "error";
    }

    get_events = async () => {
        await dbConnect();
        return await Event.find().sort({ date: 1, time: 1 }).lean();
    }

    get_event = async (id: string) => {
        await dbConnect();
        if (!id || !mongoose.isValidObjectId(id)) {
            return null;
        }
        try {
            return await Event.findById(id).populate('eventMinisters').populate('bulletinId').lean();
        } catch (error) {
            console.error("Populate failed in get_event, falling back to unpopulated:", error);
            return await Event.findById(id).lean();
        }
    }

    update_event = async (id: string, data: any) => {
        await dbConnect();
        if (!id || !mongoose.isValidObjectId(id)) {
            return null;
        }
        const cleanedData = this.cleanup_data(data);
        return await Event.findByIdAndUpdate(id, cleanedData);
    }

    delete_event = async (id: string) => {
        await dbConnect();
        if (!id || !mongoose.isValidObjectId(id)) {
            return null;
        }
        return await Event.findByIdAndDelete(id);
    }
}

export default EventService
