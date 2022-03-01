import { clearSearch } from "../utls/_helper";
import StateModel from "../data-base/models/state";

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
}