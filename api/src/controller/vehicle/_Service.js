import VehicleTypeModel from "../../data-base/models/vehicleType";
import VehicleModelModel from "../../data-base/models/vehicleModel";
import VehicleModel from "../../data-base/models/vehicle";
import VehicleOwnerModel from "../../data-base/models/vehicleOwner";
import { clearSearch } from "../../utls/_helper";
import { uploadFile } from "../../utls/_helper";
import config from "../../utls/config";

export default class Service {

    static async listVehicleOwner(query) {
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

            response.data.docs = await VehicleOwnerModel.find(search)
                // .populate(
                //     [
                //         {
                //             path: 'owner',
                //             select: 'first_name last_name email',
                //         },
                //         {
                //             path: 'driver',
                //             select: 'firstName last_name',
                //         },
                //         {
                //             path: 'vehicleType',
                //             select: 'name icon',
                //         },
                //     ]
                // )
                .select('-updatedAt -createdAt -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await VehicleOwnerModel.count().then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
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
    static async saveVehicleOwner(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await VehicleOwnerModel.findById(_id) : new VehicleOwnerModel();

            tplData.firstName = data.firstName;
            tplData.lastName = data.lastName;
            tplData.email = data.email;
            tplData.photo = await uploadFile(data.photo, config.VEHICLE_OWNER_PHOTO_UPLOAD_PATH, VehicleOwnerModel, 'photo', _id);
            tplData.password = data.password;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Vehicle owner is Updated" : "A new vehicle owner is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteVehicleOwner(id) {
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await VehicleOwnerModel.findById(id).remove();

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error("Con not delete. Something went wrong.")
        }
    }

    static async listVehicle(query) {
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

            response.data.docs = await VehicleModel.find(search)
                .populate(
                    [
                        {
                            path: 'owner',
                            select: 'first_name last_name email',
                        },
                        {
                            path: 'driver',
                            select: 'firstName last_name',
                        },
                        {
                            path: 'vehicleType',
                            select: 'name icon',
                        },
                    ]
                )
                .select('-updatedAt -createdAt -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await VehicleModel.count().then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
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
    static async saveVehicle(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await VehicleModel.findById(_id) : new VehicleModel();

            tplData.name = data.name;
            tplData.photo = await uploadFile(data.photo, config.VEHICLE_PHOTO_UPLOAD_PATH, VehicleModel, 'photo', _id);
            tplData.vehicleNumber = data.vehicleNumber;
            tplData.availableSeats = data.availableSeats;
            tplData.owner = data.owner;
            tplData.driver = data.driver;
            tplData.vehicleType = data.vehicleType;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Vehicle is Updated" : "A new vehicle is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteVehicle(id) {
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await VehicleModel.findById(id).remove();

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error("Con not delete. Something went wrong.")
        }
    }

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
                .populate(
                    [
                        {
                            path: 'vehicleCategory',
                            select: 'name icon',
                        },
                        {
                            path: 'tripCategories',
                            select: 'name icon',
                        }
                    ]
                )
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
            tplData.icon = await uploadFile(data.icon, config.VEHICLE_TYPE_ICON_UPLOAD_PATH, VehicleTypeModel, 'icon', _id);
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
            throw new Error("Con not delete. Something went wrong.")
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
                .populate(
                    [
                        {
                            path: 'vehicleType',
                            select: 'name icon',
                        }
                    ]
                )
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
            throw new Error("Con not delete. Something went wrong.")
        }
    }
}