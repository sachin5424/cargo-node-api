import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import DriverModel from "../data-base/models/driver";
import WalletModel from "../data-base/models/wallet";
import WalletHistoryModel from "../data-base/models/walletHistory";
import { clearSearch, getAdminFilter, encryptData, decryptData } from "../utls/_helper";
import { uploadFile } from "../utls/_helper";
import config from "../utls/config";
import CommonService from "./CommonService";
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
            } else {
                response.message = "Time expired";
            }

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }

    static async listDriver(query, params) {
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
                // name: {
                //     $regex: '.*' + (query?.key || '') + '.*'
                // },
                $or: [
                    {
                        firstName: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                    {
                        lastName: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                ],
                isApproved: query.isApproved ? (query.isApproved === '1' ? true : false) : '',
                vehicle: query.vehicleId ? mongoose.Types.ObjectId(query.vehicleId) : '',
                ...getAdminFilter()
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    $lookup: {
                        from: 'wallets',
                        localField: '_id',
                        foreignField: 'driver',
                        as: 'walletDetails',
                        pipeline: [
                            {
                                $project: {
                                    amount: 1
                                }
                            }
                        ]
                    }
                },
                // { $unwind: "$walletDetails" },
                {
                    "$project": {
                        vehicle: 1,
                        state: 1,
                        district: 1,
                        taluk: 1,
                        driverId: 1,
                        // name: 1,
                        firstName: 1,
                        lastName: 1,
                        phoneNo: 1,
                        email: 1,
                        otpVerified: 1,
                        dob: 1,
                        address: 1,
                        zipcode: 1,
                        image: {
                            url: { $concat: [config.applicationFileUrl + 'driver/photo/', "$photo"] },
                            name: "$photo"
                        },

                        drivingLicenceNumber: 1,
                        drivingLicenceNumberExpiryDate: 1,
                        drivingLicenceImage: {
                            url: { $concat: [config.applicationFileUrl + 'driver/document/', "$drivingLicencePhoto"] },
                            name: "$drivingLicencePhoto"
                        },

                        adharNo: 1,
                        adharCardImage: {
                            url: { $concat: [config.applicationFileUrl + 'driver/document/', "$adharCardPhoto"] },
                            name: "$adharCardPhoto"
                        },

                        panNo: 1,
                        panCardImage: {
                            url: { $concat: [config.applicationFileUrl + 'driver/document/', "$panCardPhoto"] },
                            name: "$panCardPhoto"
                        },

                        badgeNo: 1,
                        badgeImage: {
                            url: { $concat: [config.applicationFileUrl + 'driver/document/', "$badgePhoto"] },
                            name: "$badgePhoto"
                        },

                        isApproved: 1,
                        isActive: 1,
                        walletDetails: 1,
                    }
                },
            ];

            const vehicleSearch = {
                isDeleted: false,
                serviceType: query.serviceType ? mongoose.Types.ObjectId(query.serviceType) : '',
            };

            clearSearch(vehicleSearch);
            $aggregate.push(
                {
                    $lookup: {
                        from: 'vehicles',
                        localField: 'vehicle',
                        foreignField: '_id',
                        as: 'vehicleDetails',
                        pipeline: [
                            { $match: vehicleSearch },
                            {
                                $project: {
                                    name: 1,
                                    serviceType: 1
                                }
                            }
                        ]
                    }
                },
            );
            $aggregate.push({ $unwind: "$vehicleDetails" });


            const counter = await DriverModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await DriverModel.aggregate(
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

    static async saveDriver(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await DriverModel.findById(_id) : new DriverModel();

            tplData.vehicle = data.vehicle;
            tplData.state = data.state;
            tplData.district = data.district;
            tplData.taluk = data.taluk;
            tplData.driverId = data.driverId;
            tplData.firstName = data.firstName;
            tplData.lastName = data.lastName;
            tplData.phoneNo = data.phoneNo;
            tplData.email = data.email;
            !data.password || (tplData.password = data.password);
            tplData.dob = data.dob;
            tplData.address = data.address;
            tplData.zipcode = data.zipcode;
            tplData.photo = await uploadFile(data.photo, config.uploadPaths.driver.photo, DriverModel, 'photo', _id);

            tplData.drivingLicenceNumber = data.drivingLicenceNumber;
            tplData.drivingLicenceNumberExpiryDate = data.drivingLicenceNumberExpiryDate;
            tplData.drivingLicencePhoto = await uploadFile(data.drivingLicencePhoto, config.uploadPaths.driver.document, DriverModel, 'drivingLicencePhoto', _id);

            tplData.adharNo = data.adharNo;
            tplData.adharCardPhoto = await uploadFile(data.adharCardPhoto, config.uploadPaths.driver.document, DriverModel, 'adharCardPhoto', _id);

            tplData.panNo = data.panNo;
            tplData.panCardPhoto = await uploadFile(data.panCardPhoto, config.uploadPaths.driver.document, DriverModel, 'panCardPhoto', _id);

            tplData.badgeNo = data.badgeNo;
            tplData.badgePhoto = await uploadFile(data.badgePhoto, config.uploadPaths.driver.document, DriverModel, 'badgePhoto', _id);

            tplData.owner = data.owner;

            tplData.isApproved = data.isApproved;
            tplData.isActive = data.isActive;

            await tplData.save();

            try {
                if (_id) {
                    await this.findOrCreateWallet(tplData._id);
                }
            } catch (e) {
                tplData.remove();
                throw e;
            }


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

    static async findOrCreateWallet(driverId) {
        if (!driverId) {
            throw new Error("Driver does not exist");
        }
        try {
            let wallet = await WalletModel.findOne({ driver: mongoose.Types.ObjectId(driverId) });
            if (!wallet) {
                console.log('yes');
                wallet = new WalletModel();
                wallet.amount = 0;
                wallet.driver = driverId;
                await wallet.save();
            }
            return wallet;
        } catch (e) {
            console.log(driverId);
            console.log(e.message);
            throw new Error("Error! Either wallet does not exist or can not be created");
        }

    }

    static async walletDataLogicAdmin(data) {
        const res = {
            ...data,
            transactionId: '',
            transactionType: data.transactionType,
            transactionMethod: 'byAdmin',
            amount: data.amount,
            status: 'pending'
        }
        const tempData = await WalletHistoryModel.findOne().sort({ transactionId: -1 });
        if (tempData?.transactionId) {
            let transactionId = tempData.transactionId;
            transactionId += 1;
            res.transactionId = parseInt(tempData.transactionId) + 1;
        } else {
            res.transactionId = parseInt(Math.random() * 10000000000000000);
        }
        return res;
    }
    static async listWalletHistory(query, params) {
        const isAll = params.isAll === 'ALL';
        const driverId = query.driverId;
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
            const wallet = await this.findOrCreateWallet(driverId);
            const search = {
                wallet: wallet._id,
                _id: query._id,
                transactionId: query?.key ? parseInt(query?.key) : '',
                transactionType: query.transactionType || '',
                transactionMethod: query.transactionMethod || '',
                status: query.status || '',
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                // {
                //     $lookup: {
                //         from: 'drivers',
                //         localField: 'driver',
                //         foreignField: '_id',
                //         as: 'driverDetails',
                //         pipeline: [
                //             {
                //                 $project: {
                //                     name: 1
                //                 }
                //             }
                //         ]
                //     }
                // },
                {
                    "$project": {
                        transactionId: 1,
                        transactionType: 1,
                        transactionMethod: 1,
                        amount: 1,
                        previousAmount: 1,
                        currentAmount: 1,
                        status: 1,
                        description: 1,
                        driverDetails: 1
                    }
                },
                // { $unwind: "$driverDetails" }
            ];

            const counter = await WalletHistoryModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await WalletHistoryModel.aggregate(
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
    static async saveWalletHistory(data) {
        const response = { statusCode: 400, message: 'Error!', status: false };
        try {
            const wallet = await this.findOrCreateWallet(data.driverId);
            const tplData = new WalletHistoryModel();

            tplData.wallet = wallet._id;
            tplData.transactionId = data.transactionId;
            tplData.transactionType = data.transactionType;
            tplData.transactionMethod = data.transactionMethod;
            tplData.amount = data.amount;
            tplData.previousAmount = data.previousAmount;
            tplData.currentAmount = data.currentAmount;
            tplData.status = data.status;
            tplData.description = data.description;

            await tplData.save();

            tplData.status = 'completed';
            await tplData.save();

            try {
                await CommonService.updateWallet(tplData);
            } catch (e) {
                await tplData.remove();
                throw e;
            }

            response.message = "Wallet is updated";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
}