import { clearSearch } from "../utls/_helper";
import StateModel from "../data-base/models/state";
import DistrictModel from "../data-base/models/district";
import TalukModel from "../data-base/models/taluk";



export default class Service {

    static async sdtList(query) {
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            result: {
                data: [],
            },
            status: false
        };

        try {
            const searchState = global.state ? {_id: global.state} : {};
            const searchDistrict = global.district ? {_id: global.district} : {};
            const searchTaluk = global.taluk ? {_id: global.taluk} : {};
            clearSearch(searchState);
            clearSearch(searchDistrict);
            clearSearch(searchTaluk);


            const aggregate = [
                {
                    $match: searchState
                },
                {
                    $lookup: {
                        from: 'districts',
                        localField: '_id',
                        foreignField: 'state',
                        as: 'districts',
                        pipeline: [
                            {
                                $match: searchDistrict
                            },
                            {
                                $lookup: {
                                    from: 'taluks',
                                    localField: '_id',
                                    foreignField: 'district',
                                    as: 'taluks',
                                    pipeline: [
                                        {
                                            $match: searchTaluk
                                        },
                                        {
                                            $project: {
                                                "name": 1
                                            }
                                        },
                                    ],
                                }
                            },
                            {
                                $project: {
                                    "name": 1,
                                    "taluks": 1
                                }
                            },
                        ],
                    }
                },
                {
                    $project: {
                        "name": 1,
                        "districts": 1
                    }
                },
                

            ];

            response.result.data = await StateModel.aggregate(aggregate)

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

    static async listState(query, params) {
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
                ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        name: 1,
                        isActive: 1,
                    }
                },
            ];


            const counter = await StateModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await StateModel.aggregate(
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

            console.log("res", response);
            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async saveState(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await StateModel.findById(_id) : new StateModel();
            tplData.name = data.name;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "State is updated" : "A new state is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteState(_id, cond) {
        clearSearch({ cond });
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await StateModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }

    static async listDistrict(query, params) {
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
                        state: query.state ? mongoose.Types.ObjectId(query.state) : '',
                    }
                ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        name: 1,
                        state: 1,
                        isActive: 1,
                    }
                },
            ];


            const counter = await DistrictModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await DistrictModel.aggregate(
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
    static async saveDistrict(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await DistrictModel.findById(_id) : new DistrictModel();

            tplData.name = data.name;
            tplData.isActive = data.isActive;
            tplData.state = data.state;

            await tplData.save();

            response.message = _id ? "District is updated" : "A new district is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteDistrict(_id, cond) {
        clearSearch({ cond });
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await DistrictModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }

    static async listTaluk(query, params) {
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
                        district: query.district ? mongoose.Types.ObjectId(query.district) : '',
                    }
                ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        name: 1,
                        district: 1,
                        isActive: 1,
                    }
                },
            ];


            const counter = await TalukModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await TalukModel.aggregate(
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
    static async saveTaluk(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await TalukModel.findById(_id) : new TalukModel();

            tplData.name = data.name;
            tplData.isActive = data.isActive;
            tplData.district = data.district;

            await tplData.save();

            response.message = _id ? "Taluk is updated" : "A new Taluk is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteTaluk(_id, cond) {
        clearSearch({ cond });
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await TalukModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }
}