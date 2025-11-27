import ChurchProfile from "../models/church-profile";
import dbConnect from "../db";
dbConnect();

class ChurchProfileService {
    add_profile = async (data: any) => {
        if (await ChurchProfile.create(data)) return "created";
        return "error";
    }

    get_profiles = async () => {
        return await ChurchProfile.find();
    }

    get_profile = async (id: string) => {
        return await ChurchProfile.findById(id);
    }

    update_profile = async (id: string, data: any) => {
        return await ChurchProfile.findByIdAndUpdate(id, data);
    }

    delete_profile = async (id: string) => {
        return await ChurchProfile.findByIdAndDelete(id);
    }
}

export default ChurchProfileService
