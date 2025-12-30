import Sermon from "../models/sermon";
import "../models/minister";
import "../models/bulletin";
import connectDB from "../db";
connectDB();

export default class SermonService {
    async add_sermon(data: any) {
        try {
            const sermon = await Sermon.create(data);
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
            const sermon = await Sermon.findByIdAndUpdate(id, data, { new: true });
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
