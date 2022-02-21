import CustomerModel from "../../../data-base/models/customer";
import CustomerLocationModel from "../../../data-base/models/customerLocation";
import { clearSearch, getAdminFilter } from "../../../utls/_helper";
import { uploadFile } from "../../../utls/_helper";
import config from "../../../utls/config";

export default class Service {

    static async listCustomer(query, cuser) {
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            data: {
                docs: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
                totalDocs: 0,
            },
            status: false
        };

        try {
            const search = { _id: query._id, isDeleted: false, ...getAdminFilter(cuser) };
            clearSearch(search);

            response.data.docs = await CustomerModel.find(search)
                .select('  -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await CustomerModel.count(search).then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
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

    static async saveCustomer(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await CustomerModel.findById(_id) : new CustomerModel();

            tplData.firstName = data.firstName;
            tplData.lastName = data.lastName;
            tplData.phoneNo = data.phoneNo;
            tplData.email = data.email;
            tplData.password = data.password;
            tplData.dob = data.dob;
            tplData.photo = await uploadFile(data.photo, config.uploadPaths.customer.photo, CustomerModel, 'photo', _id);
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
    static async deleteCustomer(id) {
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await CustomerModel.findById(id).update({isDeleted: true});

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }

    static async listLocation(query, customer) {
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            data: {
                docs: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
                totalDocs: 0,
            },
            status: false
        };

        try {
            const search = { _id: query._id, isDeleted: false, customer};
            clearSearch(search);

            response.data.docs = await CustomerLocationModel.find(search)
                .select('  -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await CustomerLocationModel.count(search).then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
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

    static async saveLocation(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await CustomerLocationModel.findById(_id) : new CustomerLocationModel();

            tplData.customer = data.customer;
            tplData.name = data.name;
            tplData.latlong = data.latlong;

            await tplData.save();

            response.message = _id ? "Location is Updated" : "A new location is added";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteLocation(id) {
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await CustomerLocationModel.findById(id).update({isDeleted: true});

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }
}