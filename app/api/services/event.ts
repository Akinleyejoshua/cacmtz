import Event from "../models/event";
import "../models/minister";
import "../models/bulletin";
import dbConnect from "../db";
dbConnect();

class EventService {
    add_event = async (data: any) => {
        if (await Event.create(data)) return "created";
        return "error";
    }

    get_events = async () => {
        return await Event.find();
    }

    get_event = async (id: string) => {
        return await Event.findById(id).populate('eventMinisters').populate('bulletinId').lean();
    }

    update_event = async (id: string, data: any) => {
        return await Event.findByIdAndUpdate(id, data);
    }

    delete_event = async (id: string) => {
        return await Event.findByIdAndDelete(id);
    }
}

export default EventService
