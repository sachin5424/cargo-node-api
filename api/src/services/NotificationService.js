import mongoose from "mongoose";
// import Logger from '../utls/Logger';
import NotificationModel from '../data-base/models/notification';
import CustomerModel from '../data-base/models/customer';
import DriverModel from '../data-base/models/driver';
import { UserModel } from '../data-base/models/userModel';
import { clearSearch } from '../utls/_helper';

export default class Service {

    static async listNotifications(query, params) {
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
                $or: [
                    {
                        content: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'states',
                        localField: 'state',
                        foreignField: '_id',
                        as: 'stateDetails',
                        pipeline: [
                            {
                                $project: {
                                    name: 1
                                }
                            }
                        ]
                    }
                },
                { $unwind: "$stateDetails" },
                // {
                //     $lookup: {
                //         from: 'districts',
                //         localField: 'district',
                //         foreignField: '_id',
                //         as: 'districtDetails',
                //         pipeline: [
                //             {
                //                 $project: {
                //                     name: 1
                //                 }
                //             }
                //         ]
                //     }
                // },
                // { $unwind: "$districtDetails" },
                // {
                //     $lookup: {
                //         from: 'taluks',
                //         localField: 'taluk',
                //         foreignField: '_id',
                //         as: 'talukDetails',
                //         pipeline: [
                //             {
                //                 $project: {
                //                     name: 1
                //                 }
                //             }
                //         ]
                //     }
                // },
                // { $unwind: "$talukDetails" },
                {
                    "$project": {
                        state: 1,
                        district: 1,
                        taluk: 1,
                        serviceType: 1,
                        to: 1,
                        userIds: 1,
                        content: 1,
                        stateDetails: 1,
                        districtDetails: 1,
                        talukDetails: 1,

                    }
                },
            ];

            const counter = await NotificationModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await NotificationModel.aggregate(
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
            throw new Error(e);
        }
    }
    static async saveNotification(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await NotificationModel.findById(_id) : new NotificationModel();

            tplData.state = data.state;
            tplData.district = data.district;
            tplData.taluk = data.taluk;
            tplData.serviceType = data.serviceType;
            tplData.to = data.to;
            tplData.content = data.content;

            if (data.to === 'allCustomers') {
                data.userIds = await this.getCustomerIds(data);
            }
            if (data.to === 'allDrivers') {
                data.userIds = await this.getDriverIds(data);
            }
            if (data.to === 'allAdmins') {
                data.userIds = await this.getAdminIds(data);
            }

            tplData.userIds = data.userIds;

            await tplData.save();

            response.message = _id ? "Notificaion is Updated" : "A new notification is sent";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e);
        }
    }
    static async deleteNotificationPermanent(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await NotificationModel.deleteOne({ _id, ...cond });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.");
        }
    }

    static async getCustomerIds(data) {
        const search = {
            isDeleted: false,
            state: data.state ? mongoose.Types.ObjectId(data.state) : '',
            district: data.district ? mongoose.Types.ObjectId(data.district) : '',
            taluk: data.taluk ? mongoose.Types.ObjectId(data.taluk) : '',
        };

        clearSearch(search);
        const userDatas = await CustomerModel.find(search);
        data.userIds = userDatas.map(v => v._id);
        return data.userIds;
    }
    static async getDriverIds(data) {
        const search = {
            isDeleted: false,
            state: data.state ? mongoose.Types.ObjectId(data.state) : '',
            district: data.district ? mongoose.Types.ObjectId(data.district) : '',
            taluk: data.taluk ? mongoose.Types.ObjectId(data.taluk) : '',
            serviceType: data.serviceType ? mongoose.Types.ObjectId(data.serviceType) : '',
        };

        clearSearch(search);
        const userDatas = await DriverModel.find(search);
        data.userIds = userDatas.map(v => v._id);

        return data.userIds;
    }
    static async getAdminIds(data) {
        const search = {
            isDeleted: false,
            state: data.state ? mongoose.Types.ObjectId(data.state) : '',
            district: data.district ? mongoose.Types.ObjectId(data.district) : '',
            taluk: data.taluk ? mongoose.Types.ObjectId(data.taluk) : '',
        };

        clearSearch(search);
        const userDatas = await UserModel.find(search);
        data.userIds = userDatas.map(v => v._id);

        return data.userIds;
    }

}