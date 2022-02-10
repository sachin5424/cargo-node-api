import VehicleTypeModel from "../../data-base/models/vehicleType";
import VehicleModelModel from "../../data-base/models/vehicleModel";
import { clearSearch } from "../../utls/_helper";

export default class Service {
    static async listType(query) {
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            data: {
                docs: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
                totalDocs: 0,
            },
            status: false
        };

        try {
            const search = { _id: query._id };
            clearSearch(search);

            response.data.docs = await VehicleTypeModel.find(search)
                .select('-updatedAt -createdAt -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await VehicleTypeModel.count().then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
                    return data;
                })
                .catch(err => { throw new Error(err.message) })

            if (response.data.docs.length) {
                response.message = "Data fetched";
            }
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async saveType(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await VehicleTypeModel.findById(_id) : new VehicleTypeModel();

            tplData.name = data.name;
            tplData.icon = data.icon;
            tplData.priceKM = data.priceKM;
            tplData.tripCategories = data.tripCategories;
            tplData.vehicleCategory = data.vehicleCategory;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Vehicle type is Updated" : "A new vehicle type is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteType(id) {
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await VehicleTypeModel.findById(id).remove();

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }


    static async listModel(query) {
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            data: {
                docs: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
                totalDocs: 0,
            },
            status: false
        };

        try {
            const search = { _id: query._id };
            clearSearch(search);

            response.data.docs = await VehicleModelModel.find(search)
                .select('-updatedAt -createdAt -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await VehicleModelModel.count().then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
                    return data;
                })
                .catch(err => { throw new Error(err.message) })

            if (response.data.docs.length) {
                response.message = "Data fetched";
            }
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async saveModel(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await VehicleModelModel.findById(_id) : new VehicleModelModel();

            tplData.name = data.name;
            tplData.description = data.description;
            tplData.vehicleType = data.vehicleType;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Vehicle model is Updated" : "A new vehicle model is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteModel(id) {
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await VehicleModelModel.findById(id).remove();

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
}