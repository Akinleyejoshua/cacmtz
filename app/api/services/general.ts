import General from "../models/general";
import dbConnect from "../db";
dbConnect();

class GeneralService {
    get_general = async () => {
        let general: any = await General.findOne();
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
