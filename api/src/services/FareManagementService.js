import mongoose from "mongoose";
import FareManagementModel from "../data-base/models/fareManagement";
import { clearSearch, getAdminFilter } from "../utls/_helper";

export default class Service {
    static async listFareManagemengt(query, params) {
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
                ...getAdminFilter()
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        // serviceType: 1,
                        rideType: 1,
                        vehicleCategory: 1,
                        state: 1,
                        district: 1,
                        taluk: 1,
                        baseFare: 1,
                        bookingFare: 1,
                        perMinuteFare: 1,
                        cancelCharge: 1,
                        waitingCharge: 1,
                        adminCommissionType: 1,
                        adminCommissionValue: 1,
                        perKMCharges: 1,
                    }
                },
            ];

            const counter = await FareManagementModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await FareManagementModel.aggregate(
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
    static async saveFareManagemengt(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await FareManagementModel.findById(_id) : new FareManagementModel();

            // tplData.serviceType = data.serviceType;
            tplData.rideType = data.rideType;
            tplData.vehicleCategory = data.vehicleCategory;
            tplData.state = data.state;
            tplData.district = data.district;
            tplData.taluk = data.taluk;
            tplData.baseFare = data.baseFare;
            tplData.bookingFare = data.bookingFare;
            tplData.perMinuteFare = data.perMinuteFare;
            tplData.cancelCharge = data.cancelCharge;
            tplData.waitingCharge = data.waitingCharge;
            tplData.adminCommissionType = data.adminCommissionType;
            tplData.adminCommissionValue = data.adminCommissionValue;
            tplData.perKMCharges = data.perKMCharges;

            await tplData.save();

            try {
                if (_id) {
                    await this.findOrCreateWallet(tplData._id);
                }
            } catch (e) {
                tplData.remove();
                throw e;
            }


            response.message = _id ? "Fare management is Updated" : "A new fare management is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteFareManagemengt(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await FareManagementModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }
    static async deleteFareManagemengtPermanent(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await FareManagementModel.deleteOne({ _id, ...cond });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }
}