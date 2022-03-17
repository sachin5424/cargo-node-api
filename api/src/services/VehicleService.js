import VehicleModel from "../data-base/models/vehicle";
import { clearSearch, encryptData, decryptData, getAdminFilter, uploadMultipleFile } from "../utls/_helper";
import { uploadFile } from "../utls/_helper";
import config from "../utls/config";
// import { sendResetPasswordMail } from "../thrirdParty/emailServices/vehicleOwner/sendEmail";
import VehicleCategoryModel from "../data-base/models/vehicaleCategoryModel";
import ColorModel from "../data-base/models/color";
import MakeModel from "../data-base/models/make";
import MakeModelModel from "../data-base/models/makeModel";

export default class Service {

    /*
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
                const JWT_EXP_DUR = config.jwt.expDuration;
                const accessToken = jwt.sign({ sub: owner._id.toString(), exp: Math.floor(Date.now() / 1000) + ((JWT_EXP_DUR) * 60), }, config.jwt.secretKey);

                if (!owner.emailVerfied) {
                    response.statusCode = 401;
                    response.message = "Email is not verified. Please verify from the link sent to your email!!";
                } else if (!owner.isActive) {
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
    static async ownerVerifyEmail(email) {
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const owner = await VehicleOwnerModel.findOne({ email: email, isDeleted: false });
            if (owner) {
                if (owner.emailVerfied) {
                    response.message = "Email is already verified";
                } else {
                    owner.emailVerfied = true;
                    await owner.save();
                    response.message = "Email is verified";
                }
                response.statusCode = 200;
                response.status = true;
            } else {
                throw new Error("Invalid path");
            }
        } catch (e) {
            throw new Error(e.message);
        }

        return response;
    }
    static async ownerGenForgetPasswordUrl(email) {
        const response = { statusCode: 400, message: 'Error!', status: false };
        try {
            const tplData = await VehicleOwnerModel.findOne({ email: email, isDeleted: false });
            if (tplData) {
                const timeStamp = new Date().getTime() + config.forgetPassExpTime * 60 * 1000;
                const encKey = encryptData(encryptData(timeStamp + '-----' + email));
                await sendResetPasswordMail({ key: encKey, email: email, validFor: config.forgetPassExpTime });
                response.message = "A reset password link has been sent to your email. Please check and reset your password.";
                response.statusCode = 200;
                response.status = true;
            } else {
                throw new Error("This email is not registered with any account");
            }
        } catch (e) {
            throw new Error(e.message);
        }
        return response;
    }
    static async ownerResetPAssword(key, data) {
        const response = { statusCode: 400, message: 'Error!', status: false };
        try {
            const decKey = decryptData(decryptData(key));
            const timeStamp = decKey.split('-----')[0];
            const email = decKey.split('-----')[1];
            const cTimeStamp = new Date().getTime();

            const tplData = await VehicleOwnerModel.findOne({ email, isDeleted: false });

            if (timeStamp >= cTimeStamp) {
                if (tplData) {
                    tplData.password = data.password;
                    await tplData.save();
                    response.message = "Password is updated. Try login aganin";
                    response.statusCode = 200;
                    response.status = true;
                }
            } else {
                response.message = "Time expired";
            }
            return response;
        } catch (e) {
            throw new Error(e)
        }
    }
    */


    static async listColor(query, params) {
        const isAll = params.isAll === 'ALL';
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            result: {
                data: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
                total: 0,
            },
            status: false
        };

        try {
            const search = {
                _id: query._id,
                isDeleted: false,
                $or: [
                    {
                        name: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                    {
                        code: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        name: 1,
                        code: 1,
                        isActive: 1,
                    }
                },
            ];


            const counter = await ColorModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await ColorModel.aggregate(
                [
                    ...$aggregate,
                    { $limit: response.result.limit + response.result.limit * (response.result.page - 1) },
                    { $skip: response.result.limit * (response.result.page - 1) }
                ]);

            if (response.result.data.length) {
                response.message = "Data fetched";
            }
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }

    }
    static async saveColor(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await ColorModel.findById(_id) : new ColorModel();

            tplData.name = data.name;
            tplData.code = data.code;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Color is Updated" : "A new color is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteColor(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await ColorModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }

    static async listMake(query, params) {
        const isAll = params.isAll === 'ALL';
        const withModels = query?.models == 1;
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            result: {
                data: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
                total: 0,
            },
            status: false
        };

        try {
            const search = {
                _id: query._id,
                isActive: query?.active ? (query.active === '1') : '',
                isDeleted: false,
                $or: [
                    {
                        name: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                    {
                        key: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        name: 1,
                        key: 1,
                        isActive: 1,
                        models: 1
                    }
                },
            ];

            if (withModels) {
                const modelSearch = {
                    isActive: query?.modelActive ? (query.modelActive === '1') : '',
                    isDeleted: false,
                };

                clearSearch(modelSearch);
                $aggregate.push(
                    {
                        $lookup: {
                            from: 'makemodels',
                            localField: '_id',
                            foreignField: 'make',
                            as: 'models',
                            pipeline: [
                                { $match: modelSearch },
                                {
                                    $project: {
                                        name: 1
                                    }
                                }
                            ]
                        }
                    },
                );
            }


            const counter = await MakeModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await MakeModel.aggregate(
                [
                    ...$aggregate,
                    { $limit: response.result.limit + response.result.limit * (response.result.page - 1) },
                    { $skip: response.result.limit * (response.result.page - 1) }
                ]);

            if (response.result.data.length) {
                response.message = "Data fetched";
            }
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }

    }
    static async saveMake(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await MakeModel.findById(_id) : new MakeModel();

            tplData.name = data.name;
            tplData.key = data.key;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Make is Updated" : "A new make is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteMake(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await MakeModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }

    static async listMakeModel(query, params) {
        const isAll = params.isAll === 'ALL';
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            result: {
                data: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
                total: 0,
            },
            status: false
        };

        try {
            const search = {
                _id: query._id,
                isDeleted: false,
                $or: [
                    {
                        name: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                    {
                        key: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'makes',
                        localField: 'make',
                        foreignField: '_id',
                        as: 'makeDetails',
                        pipeline: [
                            {
                                "$project": {
                                    name: 1,
                                    key: 1
                                }
                            }
                        ]
                    },
                },
                {
                    $unwind: "$makeDetails"
                },
                {
                    "$project": {
                        make: 1,
                        name: 1,
                        key: 1,
                        makeDetails: 1,
                        isActive: 1,
                    }
                },
            ];


            const counter = await MakeModelModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await MakeModelModel.aggregate(
                [
                    ...$aggregate,
                    { $limit: response.result.limit + response.result.limit * (response.result.page - 1) },
                    { $skip: response.result.limit * (response.result.page - 1) }
                ]);

            if (response.result.data.length) {
                response.message = "Data fetched";
            }
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }

    }
    static async saveMakeModel(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await MakeModelModel.findById(_id) : new MakeModelModel();

            tplData.make = data.make;
            tplData.name = data.name;
            tplData.key = data.key;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Make model is Updated" : "A new make model is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteMakeModel(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await MakeModelModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }

    static async listVehicleCategory(query, params) {
        const isAll = params.isAll === 'ALL';
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            result: {
                data: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
                total: 0,
            },
            status: false
        };

        try {
            const search = {
                _id: query._id,
                isDeleted: false,
                $or: [
                    {
                        name: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                    {
                        slug: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        name: 1,
                        slug: 1,
                        isActive: 1,
                        image: {
                            url: { $concat: [config.applicationFileUrl + 'vehicle/category/', "$photo"] },
                            name: "$photo"
                        }
                    }
                },
            ];


            const counter = await VehicleCategoryModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await VehicleCategoryModel.aggregate(
                [
                    ...$aggregate,
                    { $limit: response.result.limit + response.result.limit * (response.result.page - 1) },
                    { $skip: response.result.limit * (response.result.page - 1) }
                ]);

            if (response.result.data.length) {
                response.message = "Data fetched";
            }
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async saveVehicleCategory(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await VehicleCategoryModel.findById(_id) : new VehicleCategoryModel();

            tplData.name = data.name;
            tplData.slug = data.slug;
            tplData.photo = await uploadFile(data.photo, config.uploadPaths.vehicle.category, VehicleCategoryModel, 'photo', _id);
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Vehicle category is Updated" : "A new vehicle category is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteVehicleCategory(_id, cond) {
        clearSearch({ cond });
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await VehicleCategoryModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }


    static async listVehicle(query, params) {
        const isAll = params.isAll === 'ALL';
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            result: {
                data: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
                total: 0,
            },
            status: false
        };

        try {
            const search = {
                _id: query._id,
                isDeleted: false,
                $or: [
                    {
                        name: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                    {
                        vehicleNumber: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        serviceType: 1,
                        rideTypes: 1,
                        vehicleCategory: 1,
                        name: 1,
                        vehicleNumber: 1,
                        availableSeats: 1,
                        availableCapacity: 1,
                        isActive: 1,
                        // otherPhotos: 1,
                        image: {
                            url: { $concat: [config.applicationFileUrl + 'vehicle/photo/', "$primaryPhoto"] },
                            name: "$primaryPhoto"
                        },
                        otherPhotos: {
                            $map: {
                                input: "$otherPhotos",
                                as: "images",
                                in: {
                                    url: { $concat: [config.applicationFileUrl + 'vehicle/photo/', "$$images"] },
                                    name: "$$images",
                                }
                            }
                        },
                    }
                },
            ];


            const counter = await VehicleModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await VehicleModel.aggregate(
                [
                    ...$aggregate,
                    { $limit: response.result.limit + response.result.limit * (response.result.page - 1) },
                    { $skip: response.result.limit * (response.result.page - 1) }
                ]);

            if (response.result.data.length) {
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

            tplData.serviceType = data.serviceType;
            tplData.rideTypes = data.rideTypes;
            tplData.vehicleCategory = data.vehicleCategory;
            tplData.name = data.name;
            tplData.primaryPhoto = await uploadFile(data.primaryPhoto, config.uploadPaths.vehicle.photo, VehicleModel, 'primaryPhoto', _id);
            tplData.otherPhotos = await uploadMultipleFile(data.otherPhotos, config.uploadPaths.vehicle.photo, VehicleModel, 'otherPhotos', _id, data.deletingFiles);
            tplData.vehicleNumber = data.vehicleNumber;
            tplData.availableSeats = data.availableSeats;
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
            await VehicleModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }
}