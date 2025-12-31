import Sermon from "../models/sermon";
import Minister from "../models/minister";
import Bulletin from "../models/bulletin";
import connectDB from "../db";

// Ensure models are registered
const _ = { Minister, Bulletin };

connectDB();

export default class SermonService {
    private cleanup_data(data: any) {
        if (data.bulletinId === "") delete data.bulletinId;
        if (data.minister === "") delete data.minister;
        return data;
    }

    async add_sermon(data: any) {
        try {
            const cleanedData = this.cleanup_data(data);
            const sermon = await Sermon.create(cleanedData);
            return sermon;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async get_sermons() {
        try {
            const sermons = await Sermon.find()
                .populate('minister')
                .populate('bulletinId')
                .sort({ date: -1 });
            return sermons;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async get_sermon(id: string) {
        try {
            const sermon = await Sermon.findById(id)
                .populate('minister')
                .populate('bulletinId');
            return sermon;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update_sermon(id: string, data: any) {
        try {
            const cleanedData = this.cleanup_data(data);
            const sermon = await Sermon.findByIdAndUpdate(id, cleanedData, { new: true });
            return sermon;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async delete_sermon(id: string) {
        try {
            const sermon = await Sermon.findByIdAndDelete(id);
            return sermon;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async get_latest_sermon() {
        try {
            const sermon = await Sermon.findOne()
                .populate('minister')
                .populate('bulletinId')
                .sort({ date: -1 });
            return sermon;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
