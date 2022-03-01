import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import CustomerModel from "../data-base/models/customer";
import CustomerLocationModel from "../data-base/models/customerLocation";
import { clearSearch, getAdminFilter, encryptData, decryptData } from "../utls/_helper";
import { uploadFile } from "../utls/_helper";
import config from "../utls/config";
import { sendResetPasswordMail } from "../thrirdParty/emailServices/customer/sendEmail";

export default class Service {

    static async customerLogin(data) {
        const response = { statusCode: 400, message: 'Error!', status: false };
        const email = data.email;
        const password = data.password;

        try {
            const owner = await CustomerModel.findOne({ email: email, isDeleted: false });
            let isPasswordMatched = await bcrypt.compare(password, owner.password);
            if (!isPasswordMatched) {
                throw new Error("Invalid Credentials");
            } else {
                const JWT_EXP_DUR = config.jwt.expDuration;
                const accessToken = jwt.sign({ sub: owner._id.toString(), exp: Math.floor(Date.now() / 1000) + ((JWT_EXP_DUR) * 60), }, config.jwt.secretKey);

                if (!owner.emailVerified) {
                    response.statusCode = 401;
                    response.message = "Email is not verified. Please verify from the link sent to your email!!";
                } else if (!owner.isActive) {
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
            const owner = await CustomerModel.findOne({ email: email, isDeleted: false });
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
            const tplData = await CustomerModel.findOne({ email: email, isDeleted: false });
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

            const tplData = await CustomerModel.findOne({ email, isDeleted: false });

            if (timeStamp >= cTimeStamp) {
                if (tplData) {
                    tplData.password = data.password;
                    await tplData.save();
                    response.message = "Password is updated. Try login aganin";
                    response.statusCode = 200;
                    response.status = true;
                }
            } else {
                response.message = "Time expired";
            }
            return response;
        } catch (e) {
            throw new Error(e)
        }
    }

    static async listCustomer(query, params) {
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
                        dob: 1,
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



            response.result.data = await CustomerModel.aggregate(
                [
                    ...$aggregate,
                    { $limit: response.result.limit + response.result.limit * (response.result.page - 1) },
                    { $skip: response.result.limit * (response.result.page - 1) }
                ])
                .then(async function (data) {
                    await CustomerModel.aggregate([...$aggregate, { $count: "total" }]).then(count => { response.result.total = count[0].total }).catch(err => { response.result.total = 0 })
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

    static async saveCustomer(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await CustomerModel.findById(_id) : new CustomerModel();

            tplData.firstName = data.firstName;
            tplData.lastName = data.lastName;
            tplData.phoneNo = data.phoneNo;
            tplData.email = data.email;
            (!data.password || (tplData.password = data.password));
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
    static async deleteCustomer(_id, cond) {
        clearSearch({ cond });
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await CustomerModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }
    static async deleteCustomerPermanent(cond) {
        await CustomerModel.deleteOne({ ...cond });
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
            const search = { _id: query._id, isDeleted: false, customer };
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
    static async deleteLocation(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await CustomerLocationModel.updateOne({ _id, ...cond }, { isDeleted: true });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.")
        }
    }
}