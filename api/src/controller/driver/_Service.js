import DriverModel from "../../data-base/models/driver";
import { clearSearch, getAdminFilter } from "../../utls/_helper";
import { uploadFile } from "../../utls/_helper";
import config from "../../utls/config";

export default class Service {

    static async listDriver(query, cuser) {
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

            response.data = search;
            return response;

            response.data.docs = await DriverModel.find(search)
                .select('  -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await DriverModel.count(search).then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
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
            // tplData.driverId = data.driverId;
            tplData.phoneNo = data.phoneNo;
            tplData.email = data.email;
            tplData.password = data.password;
            tplData.dob = data.dob;
            tplData.photo = await uploadFile(data.photo, config.uploadPaths.driver.photo, DriverModel, 'photo', _id);
            tplData.drivingLicenceNumber = data.drivingLicenceNumber;
            tplData.drivingLicenceImage = await uploadFile(data.drivingLicenceImage, config.uploadPaths.driver.licence, DriverModel, 'drivingLicenceImage', _id);
            tplData.drivingLicenceNumberExpiryDate = data.drivingLicenceNumberExpiryDate;
            tplData.adharNo = data.adharNo;
            tplData.adharImage = await uploadFile(data.adharImage, config.uploadPaths.driver.adhar, DriverModel, 'adharImage', _id);
            tplData.panNo = data.panNo;
            tplData.panImage = await uploadFile(data.panImage, config.uploadPaths.driver.pan, DriverModel, 'panImage', _id);
            tplData.badgeNo = data.badgeNo;
            tplData.badgeImage = await uploadFile(data.badgeImage, config.uploadPaths.driver.badge, DriverModel, 'badgeImage', _id);
            tplData.address = data.address;
            tplData.state = data.state;
            tplData.district = data.district;
            tplData.taluk = data.taluk;
            tplData.zipcode = data.zipcode;
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
            await DriverModel.findById(id).update({isDeleted: true});

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }
}