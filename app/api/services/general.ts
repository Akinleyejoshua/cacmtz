import General from "../models/general";
import Event, { IEvent } from '../models/event';
import dbConnect from "../db";
dbConnect();

class GeneralService {
    get_general = async () => {
        let latestEvent: IEvent | null = await Event.findOne().sort({ createdAt: -1 }).lean();
        let general: any = await General.findOne().populate('latestEvent').lean();
        if (!general) {
            general = await General.create({});
            general = general.toObject();
        }
        return general;
    }

    update_general = async (data: any) => {
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
