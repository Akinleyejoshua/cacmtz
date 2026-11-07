import General from "../models/general";
import Event, { IEvent } from '../models/event';
import dbConnect from "../db";

class GeneralService {
    get_general = async () => {
        await dbConnect();
        let latestEvent: IEvent | null = await Event.findOne().sort({ createdAt: -1 }).lean();
        let general: any = await General.findOne().populate('latestEvent').lean();
        if (!general) {
            general = await General.create({});
            general = general.toObject();
        }
        if (!general.latestEvent && latestEvent) {
            general.latestEvent = latestEvent;
        }
        return general;
    }

    update_general = async (data: any) => {
        await dbConnect();
        let general: any = await General.findOne();
        if (!general) {
            general = await General.create(data);
        } else {
            general = await General.findOneAndUpdate({}, data, { new: true });
        }
        return general;
    }
}

export default GeneralService;
