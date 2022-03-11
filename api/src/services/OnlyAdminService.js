import ModuleModel from "../data-base/models/modue";
import AdminModulesModel from "../data-base/models/adminModules";
import { UserModel } from "../data-base";
import { clearSearch } from "../utls/_helper";

export default class AdminService {

    static async listModules(query, params) {
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            result: {
                data: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 2000,
                total: 0,
            },
            status: false
        };

        try {
            const search = {};
            clearSearch(search);

            const $aggregate = [
                { $match: search },
                // { $sort: { _id: -1 } },
                {
                    $project: {
                        title: 1,
                        key: 1,
                    }
                },
            ];

            response.result.data = await ModuleModel.aggregate(
                [
                    ...$aggregate,
                    { $limit: response.result.limit + response.result.limit * (response.result.page - 1) },
                    { $skip: response.result.limit * (response.result.page - 1) }
                ])
                .then(async function (data) {
                    await ModuleModel.aggregate([...$aggregate, { $count: "total" }]).then(count => { response.result.total = count[0].total }).catch(err => { response.result.total = 0 })
                    return data;
                })
                .catch(err => { throw new Error(err.message) })

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

    static async adminModules(query) {
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
            const search = { typeName: { $regex: '.*' + query?.key + '.*' }, typeKey: { $ne: 'superAdmin' } };
            clearSearch(search);

            const $aggregate = [
                { $match: search },
                {
                    $lookup: {
                        from: "modules",
                        localField: "grantedModules",
                        foreignField: "_id",
                        as: "grantedModuleTitles",
                        pipeline: [
                            {
                                $project: {
                                    title: 1,
                                    _id: 0,
                                }
                            },
                        ]
                    }
                },
                {
                    $project: {
                        grantedModules: 1,
                        grantedModuleTitles: 1,
                        typeName: 1,
                        typeKey: 1,
                    }
                },
            ];

            response.result.data = await AdminModulesModel.aggregate(
                [
                    ...$aggregate,
                    { $limit: response.result.limit + response.result.limit * (response.result.page - 1) },
                    { $skip: response.result.limit * (response.result.page - 1) }
                ])
                .then(async function (data) {
                    await AdminModulesModel.aggregate([...$aggregate, { $count: "total" }]).then(count => { response.result.total = count[0].total }).catch(err => { response.result.total = 0 })
                    return data;
                })
                .catch(err => { throw new Error(err.message) })

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

    static async saveAdminModules(data) {
        const typeKey = data.typeKey;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = await AdminModulesModel.findOne({typeKey});
            tplData.grantedModules = data.grantedModules;

            await tplData.save();

            response.message = "User permission is updated";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }

    static async listAdmin(query, params) {
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
                            url: { $concat: [config.applicationFileUrl + 'customer/photo/', "$photo"] },
                            name: "$photo"
                        }
                    }
                },
            ];



            response.result.data = await UserModel.aggregate(
                [
                    ...$aggregate,
                    { $limit: response.result.limit + response.result.limit * (response.result.page - 1) },
                    { $skip: response.result.limit * (response.result.page - 1) }
                ])
                .then(async function (data) {
                    await UserModel.aggregate([...$aggregate, { $count: "total" }]).then(count => { response.result.total = count[0].total }).catch(err => { response.result.total = 0 })
                    return data;
                })
                .catch(err => { throw new Error(err.message) })

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
    static async saveAdmin(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await UserModel.findById(_id) : new UserModel();

            tplData.firstName = data.firstName;
            tplData.lastName = data.lastName;
            tplData.phoneNo = data.phoneNo;
            tplData.email = data.email;
            (!data.password || (tplData.password = data.password));
            tplData.dob = data.dob;
            // tplData.photo = await uploadFile(data.photo, config.uploadPaths.customer.photo, UserModel, 'photo', _id);
            tplData.address = data.address;
            tplData.state = data.state;
            tplData.district = data.district;
            tplData.taluk = data.taluk;
            tplData.zipcode = data.zipcode;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Customer is Updated" : "A new customer is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteAdmin(_id, cond) {
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