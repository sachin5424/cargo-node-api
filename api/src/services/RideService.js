import { clearSearch } from "../utls/_helper";
import { uploadFile } from "../utls/_helper";
import config from "../utls/config";
import RideTypeModel from "../data-base/models/rideTypeModel";
import mongoose from "mongoose";

export default class Service {

    static async listRideType(query, params) {
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
                serviceType: query.serviceType ? mongoose.Types.ObjectId(query.serviceType) : ''
            };

            clearSearch(search);

            console.log(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'servicetypes',
                        localField: 'serviceType',
                        foreignField: '_id',
                        as: 'serviceType',
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
                    $lookup: {
                        from: "vehiclecategories",
                        localField: "allowedVehicleCategories",
                        foreignField: "_id",
                        as: "allowedVehicleCategoriesDetails",
                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                    _id: 1,
                                }
                            },
                        ]
                    }
                },
                {
                    $unwind: "$serviceType"
                },
                {
                    "$project": {
                        name: 1,
                        // key: 1,
                        isActive: 1,
                        serviceType: 1,
                        allowedVehicleCategories: 1,
                        allowedVehicleCategoriesDetails: 1,
                        image: {
                            url: { $concat: [config.applicationFileUrl + 'ride/type/', "$photo"] },
                            name: "$photo"
                        }
                    }
                },
            ];


            const counter = await RideTypeModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await RideTypeModel.aggregate(
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
    static async saveRideType(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            // const tplData = _id ? await RideTypeModel.findById(_id) : new RideTypeModel();
            const tplData = await RideTypeModel.findById(_id);

            (data._id || (tplData.serviceType = data.serviceType));
            tplData.name = data.name;
            // tplData.key = data.key;
            tplData.allowedVehicleCategories = data.allowedVehicleCategories;
            tplData.photo = await uploadFile(data.photo, config.uploadPaths.ride.type, RideTypeModel, 'photo', _id);
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Ride type is updated" : "A new ride type is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteRideType(_id, cond) {
        clearSearch({ cond });
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            // await RideTypeModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }
}