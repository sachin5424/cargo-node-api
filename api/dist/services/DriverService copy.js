"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _driver = _interopRequireDefault(require("../data-base/models/driver"));

var _wallet = _interopRequireDefault(require("../data-base/models/wallet"));

var _walletHistory = _interopRequireDefault(require("../data-base/models/walletHistory"));

var _helper = require("../utls/_helper");

var _config = _interopRequireDefault(require("../utls/config"));

var _CommonService = _interopRequireDefault(require("./CommonService"));

var _sendEmail = require("../thrirdParty/emailServices/driver/sendEmail");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Service {
  static async driverLogin(data) {
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };
    const email = data.email;
    const password = data.password;

    try {
      const owner = await _driver.default.findOne({
        email: email,
        isDeleted: false
      });
      let isPasswordMatched = await _bcryptjs.default.compare(password, owner.password);

      if (!isPasswordMatched) {
        throw new Error("Invalid Credentials");
      } else {
        const JWT_EXP_DUR = _config.default.jwt.expDuration;

        const accessToken = _jsonwebtoken.default.sign({
          sub: owner._id.toString(),
          exp: Math.floor(Date.now() / 1000) + JWT_EXP_DUR * 60
        }, _config.default.jwt.secretKey);

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
          response.data = {
            accessToken
          };
        }
      }
    } catch (e) {
      throw new Error(e.message);
    }

    return response;
  }

  static async verifyEmail(email) {
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const owner = await _driver.default.findOne({
        email: email,
        isDeleted: false
      });

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
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = await _driver.default.findOne({
        email: email,
        isDeleted: false
      });

      if (tplData) {
        const timeStamp = new Date().getTime() + _config.default.forgetPassExpTime * 60 * 1000;
        const encKey = (0, _helper.encryptData)((0, _helper.encryptData)(timeStamp + '-----' + email));
        await (0, _sendEmail.sendResetPasswordMail)({
          key: encKey,
          email: email,
          validFor: _config.default.forgetPassExpTime
        });
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
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const decKey = (0, _helper.decryptData)((0, _helper.decryptData)(key));
      const timeStamp = decKey.split('-----')[0];
      const email = decKey.split('-----')[1];
      const cTimeStamp = new Date().getTime();
      const tplData = await _driver.default.findOne({
        email,
        isDeleted: false
      });

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
      throw new Error(e);
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
        total: 0
      },
      status: false
    };

    try {
      const search = _objectSpread({
        _id: query._id,
        isDeleted: false,
        name: {
          $regex: '.*' + (query?.key || '') + '.*'
        },
        isApproved: query.isApproved ? query.isApproved === '1' ? true : false : '',
        vehicle: query.vehicleId ? _mongoose.default.Types.ObjectId(query.vehicleId) : ''
      }, (0, _helper.getAdminFilter)());

      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, {
        $lookup: {
          from: 'wallets',
          localField: '_id',
          foreignField: 'driver',
          as: 'walletDetails',
          pipeline: [{
            $project: {
              amount: 1
            }
          }]
        }
      }, // { $unwind: "$walletDetails" },
      {
        "$project": {
          vehicle: 1,
          state: 1,
          district: 1,
          taluk: 1,
          driverId: 1,
          name: 1,
          // firstName: 1,
          // lastName: 1,
          phoneNo: 1,
          email: 1,
          otpVerified: 1,
          dob: 1,
          address: 1,
          zipcode: 1,
          image: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'driver/photo/', "$photo"]
            },
            name: "$photo"
          },
          drivingLicenceNumber: 1,
          drivingLicenceNumberExpiryDate: 1,
          drivingLicenceImage: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'driver/document/', "$drivingLicencePhoto"]
            },
            name: "$drivingLicencePhoto"
          },
          adharNo: 1,
          adharCardImage: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'driver/document/', "$adharCardPhoto"]
            },
            name: "$adharCardPhoto"
          },
          panNo: 1,
          panCardImage: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'driver/document/', "$panCardPhoto"]
            },
            name: "$panCardPhoto"
          },
          badgeNo: 1,
          badgeImage: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'driver/document/', "$badgePhoto"]
            },
            name: "$badgePhoto"
          },
          isApproved: 1,
          isActive: 1,
          walletDetails: 1
        }
      }];
      const vehicleSearch = {
        isDeleted: false,
        serviceType: query.serviceType ? _mongoose.default.Types.ObjectId(query.serviceType) : ''
      };
      (0, _helper.clearSearch)(vehicleSearch);
      $aggregate.push({
        $lookup: {
          from: 'vehicles',
          localField: 'vehicle',
          foreignField: '_id',
          as: 'vehicleDetails',
          pipeline: [{
            $match: vehicleSearch
          }, {
            $project: {
              name: 1
            }
          }]
        }
      });
      $aggregate.push({
        $unwind: "$vehicleDetails"
      });
      const counter = await _driver.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _driver.default.aggregate([...$aggregate, {
        $limit: response.result.limit + response.result.limit * (response.result.page - 1)
      }, {
        $skip: response.result.limit * (response.result.page - 1)
      }]);

      if (response.result.data.length) {
        response.message = "Data fetched";
      }

      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async saveDriver(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _driver.default.findById(_id) : new _driver.default();
      tplData.vehicle = data.vehicle;
      tplData.state = data.state;
      tplData.district = data.district;
      tplData.taluk = data.taluk;
      tplData.driverId = data.driverId;
      tplData.name = data.name; // tplData.lastName = data.lastName;

      tplData.phoneNo = data.phoneNo;
      tplData.email = data.email;
      !data.password || (tplData.password = data.password);
      tplData.dob = data.dob;
      tplData.address = data.address;
      tplData.zipcode = data.zipcode;
      tplData.photo = await (0, _helper.uploadFile)(data.photo, _config.default.uploadPaths.driver.photo, _driver.default, 'photo', _id);
      tplData.drivingLicenceNumber = data.drivingLicenceNumber;
      tplData.drivingLicenceNumberExpiryDate = data.drivingLicenceNumberExpiryDate;
      tplData.drivingLicencePhoto = await (0, _helper.uploadFile)(data.drivingLicencePhoto, _config.default.uploadPaths.driver.document, _driver.default, 'drivingLicencePhoto', _id);
      tplData.adharNo = data.adharNo;
      tplData.adharCardPhoto = await (0, _helper.uploadFile)(data.adharCardPhoto, _config.default.uploadPaths.driver.document, _driver.default, 'adharCardPhoto', _id);
      tplData.panNo = data.panNo;
      tplData.panCardPhoto = await (0, _helper.uploadFile)(data.panCardPhoto, _config.default.uploadPaths.driver.document, _driver.default, 'panCardPhoto', _id);
      tplData.badgeNo = data.badgeNo;
      tplData.badgePhoto = await (0, _helper.uploadFile)(data.badgePhoto, _config.default.uploadPaths.driver.document, _driver.default, 'badgePhoto', _id);
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
      throw new Error(e);
    }
  }

  static async deleteDriver(_id, cond) {
    cond = !cond ? {} : cond;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _driver.default.updateOne(_objectSpread({
        _id
      }, cond), {
        isDeleted: true
      });
      response.message = "Deleted successfully";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error("Can not delete. Something went wrong.");
    }
  }

  static async deleteDriverPermanent(cond) {
    await _driver.default.deleteOne(_objectSpread({}, cond));
  }

  static async findOrCreateWallet(driverId) {
    if (!driverId) {
      throw new Error("Driver does not exist");
    }

    try {
      let wallet = await _wallet.default.findOne({
        driver: _mongoose.default.Types.ObjectId(driverId)
      });

      if (!wallet) {
        wallet = new _wallet.default();
        wallet.amount = 0;
        wallet.driver = driverId;
        await wallet.save();
      }

      return wallet;
    } catch (e) {
      throw new Error("Error! Either wallet does not exist or can not be created");
    }
  }

  static async walletDataLogicAdmin(data) {
    const res = _objectSpread(_objectSpread({}, data), {}, {
      transactionId: '',
      transactionType: data.transactionType,
      transactionMethod: 'byAdmin',
      amount: data.amount,
      status: 'pending'
    });

    const tempData = await _walletHistory.default.findOne().sort({
      transactionId: -1
    });

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
        total: 0
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
        status: query.status || ''
      };
      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, // {
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
      } // { $unwind: "$driverDetails" }
      ];
      const counter = await _walletHistory.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _walletHistory.default.aggregate([...$aggregate, {
        $limit: response.result.limit + response.result.limit * (response.result.page - 1)
      }, {
        $skip: response.result.limit * (response.result.page - 1)
      }]);

      if (response.result.data.length) {
        response.message = "Data fetched";
      }

      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async saveWalletHistory(data) {
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const wallet = await this.findOrCreateWallet(data.driverId);
      const tplData = new _walletHistory.default();
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
        await _CommonService.default.updateWallet(tplData);
      } catch (e) {
        await tplData.remove();
        throw e;
      }

      response.message = "Wallet is updated";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

}

exports.default = Service;