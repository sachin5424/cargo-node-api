import { UserModel } from "../data-base";
import { clearSearch, uploadFile, getAdminFilter } from "../utls/_helper";

import config from "../utls/config";

export default class Service {

    static async listUser(query, params) {
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
                type: { $ne: 'superAdmin' },
                $or: [
                    {
                        firstName: { $regex: '.*' + query?.key + '.*' }
                    },
                    {
                        lastName: { $regex: '.*' + query?.key + '.*' }
                    },
                ],

                ...getAdminFilter()
            };
            clearSearch(search);
            // const driverFilter ={isDeleted: false, ...getAdminFilter()};
            // clearSearch(driverFilter);
            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        // serviceType: 1,
                        firstName: 1,
                        lastName: 1,
                        phoneNo: 1,
                        email: 1,
                        emailVerified: 1,
                        dob: 1,
                        type: 1,
                        address: 1,
                        state: 1,
                        district: 1,
                        taluk: 1,
                        zipcode: 1,
                        isActive: 1,
                        image: {
                            url: { $concat: [config.applicationFileUrl + 'user/photo/', "$photo"] },
                            name: "$photo"
                        }
                    }
                },
            ];


            const counter = await UserModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if(isAll){
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await UserModel.aggregate(
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
    static async saveUser(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await UserModel.findById(_id) : new UserModel();

            tplData.type = data.type;
            tplData.firstName = data.firstName;
            tplData.lastName = data.lastName;
            tplData.phoneNo = data.phoneNo;
            tplData.email = data.email;
            tplData.emailVerified = true;
            (!data.password || (tplData.password = data.password));
            tplData.dob = data.dob;
            tplData.photo = await uploadFile(data.photo, config.uploadPaths.user.photo, UserModel, 'photo', _id);
            tplData.address = data.address;
            tplData.state = data.state;
            tplData.district = data.district;
            tplData.taluk = data.taluk;
            tplData.zipcode = data.zipcode;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Admin is Updated" : "A new admin is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteUser(_id, cond) {
        clearSearch({ cond });
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await UserModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }

}