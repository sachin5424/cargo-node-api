import ModuleModel from "../data-base/models/modue";
import AdminModulesModel from "../data-base/models/adminModules";
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
}