import DriverModel from "../../data-base/models/driver";
import { clearSearch } from "../../utls/_helper";
import { uploadFile } from "../../utls/_helper";
import config from "../../utls/config";

export default class Service {

    static async listDriver(query) {
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
            const search = { _id: query._id };
            clearSearch(search);

            response.data.docs = await DriverModel.find(search)
                .select('-updatedAt -createdAt -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await DriverModel.count().then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
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
    static async saveDriver(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await DriverModel.findById(_id) : new DriverModel();

            tplData.firstName = data.firstName;
            tplData.lastName = data.lastName;
            tplData.phoneNo = data.phoneNo;
            tplData.dob = data.dob;
            tplData.photo = await uploadFile(data.photo, config.DRIVER_PHOTO_UPLOAD_PATH, DriverModel, 'photo', _id);
            tplData.drivingLicenceNumber = data.drivingLicenceNumber;
            tplData.drivingLicenceNumberExpiryDate = data.drivingLicenceNumberExpiryDate;
            tplData.adharNo = data.adharNo;
            tplData.panNo = data.panNo;
            tplData.address = data.address;
            tplData.state = data.state;
            tplData.district = data.district;
            tplData.tehsil = data.tehsil;
            tplData.pincode = data.pincode;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "Driver is Updated" : "A new driver is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
    static async deleteDriver(id) {
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await DriverModel.findById(id).remove();

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Con not delete. Something went wrong.")
        }
    }
}