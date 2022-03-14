import { clearSearch } from "../utls/_helper";
import StateModel from "../data-base/models/state";
import ServiceTypeModel from "../data-base/models/serviceType";

export default class Service {

    static async listStates(query) {
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            data: {
                docs: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 200,
                totalDocs: 0,
            },
            status: false
        };

        try {
            const search = { _id: query._id, isDeleted: false
                // name: {$regex: ".*" + query.name + ".*"} 
            };
            clearSearch(search);

            response.data.docs = await StateModel.find(search)
                .select('-__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await StateModel.count(search).then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
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

    static async listServiceType() {
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            result: {
                data: [],
            },
            status: false
        };

        try {
            response.result.data = await ServiceTypeModel.find().select({name: 1});
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