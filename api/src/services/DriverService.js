import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import DriverModel from "../data-base/models/driver";
import { clearSearch, getAdminFilter, encryptData, decryptData} from "../utls/_helper";
import { uploadFile } from "../utls/_helper";
import config from "../utls/config";
import { sendResetPasswordMail } from "../thrirdParty/emailServices/driver/sendEmail";

export default class Service {

    static async driverLogin(data) {
        const response = { statusCode: 400, message: 'Error!', status: false };
        const email = data.email;
        const password = data.password;

        try {
            const owner = await DriverModel.findOne({ email: email, isDeleted: false });
            let isPasswordMatched = await bcrypt.compare(password, owner.password);
            if (!isPasswordMatched) {
                throw new Error("Invalid Credentials");
            } else {
                const JWT_EXP_DUR= config.jwt.expDuration;
                const accessToken = jwt.sign({ sub: owner._id.toString(), exp: Math.floor(Date.now() / 1000) + ((JWT_EXP_DUR) * 60), }, config.jwt.secretKey);

                if (!owner.emailVerified) {
                    response.statusCode = 401;
                    response.message = "Email is not verified. Please verify from the link sent to your email!!";
                } else if(!owner.isActive){
                    response.statusCode = 401;
                    response.message = "Your acount is blocked. Please contact admin";
                } else {
                    response.statusCode = 200;
                    response.status = true;
                    response.message = "Loggedin successfully";

                    response.data = { accessToken };
                }
            }
        } catch (e) {
            throw new Error(e.message);
        }

        return response;
    }

    static async verifyEmail(email) {
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const owner = await DriverModel.findOne({ email: email, isDeleted: false });
            if (owner) {
                if (owner.emailVerified) {
                    response.message = "Email is already verified";
                } else {
                    owner.emailVerified = true;
                    await owner.save();
                    response.message = "Email is verified";
                }
                response.statusCode = 200;
                response.status = true;
            } else {
                throw new Error("Invalid path");
            }
        } catch (e) {
            throw new Error(e.message);
        }

        return response;
    }

    static async genForgetPasswordUrl(email) {
        const response = { statusCode: 400, message: 'Error!', status: false };
        try {
            const tplData = await DriverModel.findOne({ email: email, isDeleted: false });
            if (tplData) {
                const timeStamp = new Date().getTime() + config.forgetPassExpTime * 60 * 1000;
                const encKey = encryptData(encryptData(timeStamp + '-----' + email));
                await sendResetPasswordMail({ key: encKey, email: email, validFor: config.forgetPassExpTime });
                response.message = "A reset password link has been sent to your email. Please check and reset your password.";
                response.statusCode = 200;
                response.status = true;
            } else {
                throw new Error("This email is not registered with any account");
            }
        } catch (e) {
            throw new Error(e.message);
        }

        return response;
    }

    static async resetPAssword(key, data) {


        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const decKey = decryptData(decryptData(key));
            const timeStamp = decKey.split('-----')[0];
            const email = decKey.split('-----')[1];
            const cTimeStamp = new Date().getTime();

            const tplData = await DriverModel.findOne({ email, isDeleted: false });

            if (timeStamp >= cTimeStamp) {
                if (tplData) {
                    tplData.password = data.password;
                    await tplData.save();
                    response.message = "Password is updated. Try login aganin";
                    response.statusCode = 200;
                    response.status = true;
                }
            } else{
                response.message = "Time expired";
            }

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }

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
            const permissionFilter = cuser.type == 'vehicleOwner' ? { owner: cuser._id } : { ...getAdminFilter() };
            const search = { _id: query._id, isDeleted: false, ...permissionFilter };
            clearSearch(search);

            console.log('search', search);

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
            tplData.owner = data.owner;
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
    static async deleteDriver(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await DriverModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }
    static async deleteDriverPermanent(cond) {
        await DriverModel.deleteOne({ ...cond });
    }
}