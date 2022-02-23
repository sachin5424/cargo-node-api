import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import VehicleTypeModel from "../data-base/models/vehicleType";
import VehicleModelModel from "../data-base/models/vehicleModel";
import VehicleModel from "../data-base/models/vehicle";
import VehicleOwnerModel from "../data-base/models/vehicleOwner";
import { clearSearch } from "../utls/_helper";
import { uploadFile } from "../utls/_helper";
import config from "../utls/config";

export default class Service {

    static async ownerLogin(data) {
        const response = { statusCode: 400, message: 'Error!', status: false };
        const email = data.email;
        const password = data.password;

        try {
            const owner = await VehicleOwnerModel.findOne({ email: email, isDeleted: false });
            let isPasswordMatched = await bcrypt.compare(password, owner.password);
            if (!isPasswordMatched) {
                throw new Error("Invalid Credentials");
            } else {
                const JWT_EXP_DUR= config.jwt.expDuration;
                const accessToken = jwt.sign({ sub: owner._id.toString(), exp: Math.floor(Date.now() / 1000) + ((JWT_EXP_DUR) * 60), }, config.jwt.secretKey);

                if (!owner.emailVerfied) {
                    response.statusCode = 401;
                    response.message = "Email is not verified. Please verify from the link sent to your email!!";
                } else if(!owner.isActive){
                    response.statusCode = 401;
                    response.message = "Your acount is blocked. Please contact admin";
                } else {
                    response.statusCode = 200;
                    response.status = true;
                    response.message = "Loggedin successfully";

                    response.data = { accessToken };
                }
            }
        } catch (e) {
            throw new Error(e.message);
        }

        return response;
    }

    static async verifyEmail(email) {
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const owner = await VehicleOwnerModel.findOne({ email: email, isDeleted: false });
            if(owner){
                if(owner.emailVerfied){
                    response.message = "Email is already verified";
                } else{
                    owner.emailVerfied = true;
                    await owner.save();
                    response.message = "Email is verified";
                }
                response.statusCode = 200;
                response.status = true;
            } else{
                throw new Error("Invalid path");
            }
        } catch (e) {
            throw new Error(e.message);
        }

        return response;
    }


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
            const search = { _id: query._id, isDeleted: false };
            clearSearch(search);

            response.data.docs = await VehicleOwnerModel.find(search)
                // .populate(
                //     [
                //         {
                //             path: 'owner',
                //             select: 'firstName lastName email',
                //         },
                //         {
                //             path: 'driver',
                //             select: 'firstName lastName',
                //         },
                //         {
                //             path: 'vehicleType',
                //             select: 'name icon',
                //         },
                //     ]
                // )
                .select('  -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await VehicleOwnerModel.count(search).then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
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
            tplData.phoneNo = data.phoneNo;
            tplData.email = data.email;
            tplData.photo = await uploadFile(data.photo, config.uploadPaths.vehicle.owner, VehicleOwnerModel, 'photo', _id);
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
    static async deleteVehicleOwner(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await VehicleOwnerModel.updateOne({_id, ...cond},{isDeleted: true});

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }

    static async deleteVehicleOwnerPermanent(cond) {
        await VehicleOwnerModel.deleteOne({ ...cond });
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
            const search = { _id: query._id, isDeleted: false, owner: query.owner };
            clearSearch(search);

            response.data.docs = await VehicleModel.find(search)
                .populate(
                    [
                        {
                            path: 'owner',
                            select: 'firstName lastName email',
                        },
                        {
                            path: 'driver',
                            select: 'firstName lastName',
                        },
                        {
                            path: 'vehicleType',
                            select: 'name icon',
                        },
                    ]
                )
                .select('  -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await VehicleModel.count(search).then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
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
            tplData.photo = await uploadFile(data.photo, config.uploadPaths.vehicle.photo, VehicleModel, 'photo', _id);
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
    static async deleteVehicle(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await VehicleModel.updateOne({_id, ...cond},{isDeleted: true});

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
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
            const search = { _id: query._id, isDeleted: false };
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
                .select('  -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await VehicleTypeModel.count(search).then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
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
            tplData.icon = await uploadFile(data.icon, config.uploadPaths.vehicle.type, VehicleTypeModel, 'icon', _id);
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
    static async deleteType(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await VehicleTypeModel.updateOne({_id, ...cond},{isDeleted: true});

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            console.log(e.message);
            throw new Error("Can not delete. Something went wrong.")
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
            const search = { _id: query._id, isDeleted: false };
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
                .select('  -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await VehicleModelModel.count(search).then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
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
    static async deleteModel(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await VehicleModelModel.updateOne({_id, ...cond},{isDeleted: true});

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }
}