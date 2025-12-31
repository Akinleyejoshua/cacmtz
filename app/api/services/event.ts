import Event from "../models/event";
import "../models/minister";
import "../models/bulletin";
import dbConnect from "../db";
dbConnect();

class EventService {
    private cleanup_data(data: any) {
        if (data.bulletinId === "") delete data.bulletinId;
        if (Array.isArray(data.eventMinisters)) {
            data.eventMinisters = data.eventMinisters.filter((id: any) => id !== "");
        }
        return data;
    }

    add_event = async (data: any) => {
        const cleanedData = this.cleanup_data(data);
        if (await Event.create(cleanedData)) return "created";
        return "error";
    }

    get_events = async () => {
        return await Event.find();
    }

    get_event = async (id: string) => {
        return await Event.findById(id).populate('eventMinisters').populate('bulletinId').lean();
    }

    update_event = async (id: string, data: any) => {
        const cleanedData = this.cleanup_data(data);
        return await Event.findByIdAndUpdate(id, cleanedData);
    }

    delete_event = async (id: string) => {
        return await Event.findByIdAndDelete(id);
    }
}

export default EventService
