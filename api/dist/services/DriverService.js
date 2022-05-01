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
        // name: {
        //     $regex: '.*' + (query?.key || '') + '.*'
        // },
        $or: [{
          firstName: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }, {
          lastName: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }],
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
              name: 1,
              serviceType: 1
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
      tplData.firstName = data.firstName;
      tplData.lastName = data.lastName;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Ecml2ZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIlNlcnZpY2UiLCJkcml2ZXJMb2dpbiIsImRhdGEiLCJyZXNwb25zZSIsInN0YXR1c0NvZGUiLCJtZXNzYWdlIiwic3RhdHVzIiwiZW1haWwiLCJwYXNzd29yZCIsIm93bmVyIiwiRHJpdmVyTW9kZWwiLCJmaW5kT25lIiwiaXNEZWxldGVkIiwiaXNQYXNzd29yZE1hdGNoZWQiLCJiY3J5cHQiLCJjb21wYXJlIiwiRXJyb3IiLCJKV1RfRVhQX0RVUiIsImNvbmZpZyIsImp3dCIsImV4cER1cmF0aW9uIiwiYWNjZXNzVG9rZW4iLCJzaWduIiwic3ViIiwiX2lkIiwidG9TdHJpbmciLCJleHAiLCJNYXRoIiwiZmxvb3IiLCJEYXRlIiwibm93Iiwic2VjcmV0S2V5IiwiZW1haWxWZXJpZmllZCIsImlzQWN0aXZlIiwiZSIsInZlcmlmeUVtYWlsIiwic2F2ZSIsImdlbkZvcmdldFBhc3N3b3JkVXJsIiwidHBsRGF0YSIsInRpbWVTdGFtcCIsImdldFRpbWUiLCJmb3JnZXRQYXNzRXhwVGltZSIsImVuY0tleSIsImtleSIsInZhbGlkRm9yIiwicmVzZXRQQXNzd29yZCIsImRlY0tleSIsInNwbGl0IiwiY1RpbWVTdGFtcCIsImxpc3REcml2ZXIiLCJxdWVyeSIsInBhcmFtcyIsImlzQWxsIiwicmVzdWx0IiwicGFnZSIsImxpbWl0IiwidG90YWwiLCJzZWFyY2giLCIkb3IiLCJmaXJzdE5hbWUiLCIkcmVnZXgiLCJsYXN0TmFtZSIsImlzQXBwcm92ZWQiLCJ2ZWhpY2xlIiwidmVoaWNsZUlkIiwibW9uZ29vc2UiLCJUeXBlcyIsIk9iamVjdElkIiwiJGFnZ3JlZ2F0ZSIsIiRtYXRjaCIsIiRzb3J0IiwiJGxvb2t1cCIsImZyb20iLCJsb2NhbEZpZWxkIiwiZm9yZWlnbkZpZWxkIiwiYXMiLCJwaXBlbGluZSIsIiRwcm9qZWN0IiwiYW1vdW50Iiwic3RhdGUiLCJkaXN0cmljdCIsInRhbHVrIiwiZHJpdmVySWQiLCJwaG9uZU5vIiwib3RwVmVyaWZpZWQiLCJkb2IiLCJhZGRyZXNzIiwiemlwY29kZSIsImltYWdlIiwidXJsIiwiJGNvbmNhdCIsImFwcGxpY2F0aW9uRmlsZVVybCIsIm5hbWUiLCJkcml2aW5nTGljZW5jZU51bWJlciIsImRyaXZpbmdMaWNlbmNlTnVtYmVyRXhwaXJ5RGF0ZSIsImRyaXZpbmdMaWNlbmNlSW1hZ2UiLCJhZGhhck5vIiwiYWRoYXJDYXJkSW1hZ2UiLCJwYW5ObyIsInBhbkNhcmRJbWFnZSIsImJhZGdlTm8iLCJiYWRnZUltYWdlIiwid2FsbGV0RGV0YWlscyIsInZlaGljbGVTZWFyY2giLCJzZXJ2aWNlVHlwZSIsInB1c2giLCIkdW53aW5kIiwiY291bnRlciIsImFnZ3JlZ2F0ZSIsIiRjb3VudCIsIiRsaW1pdCIsIiRza2lwIiwibGVuZ3RoIiwic2F2ZURyaXZlciIsImZpbmRCeUlkIiwicGhvdG8iLCJ1cGxvYWRQYXRocyIsImRyaXZlciIsImRyaXZpbmdMaWNlbmNlUGhvdG8iLCJkb2N1bWVudCIsImFkaGFyQ2FyZFBob3RvIiwicGFuQ2FyZFBob3RvIiwiYmFkZ2VQaG90byIsImZpbmRPckNyZWF0ZVdhbGxldCIsInJlbW92ZSIsImRlbGV0ZURyaXZlciIsImNvbmQiLCJ1cGRhdGVPbmUiLCJkZWxldGVEcml2ZXJQZXJtYW5lbnQiLCJkZWxldGVPbmUiLCJ3YWxsZXQiLCJXYWxsZXRNb2RlbCIsIndhbGxldERhdGFMb2dpY0FkbWluIiwicmVzIiwidHJhbnNhY3Rpb25JZCIsInRyYW5zYWN0aW9uVHlwZSIsInRyYW5zYWN0aW9uTWV0aG9kIiwidGVtcERhdGEiLCJXYWxsZXRIaXN0b3J5TW9kZWwiLCJzb3J0IiwicGFyc2VJbnQiLCJyYW5kb20iLCJsaXN0V2FsbGV0SGlzdG9yeSIsInByZXZpb3VzQW1vdW50IiwiY3VycmVudEFtb3VudCIsImRlc2NyaXB0aW9uIiwiZHJpdmVyRGV0YWlscyIsInNhdmVXYWxsZXRIaXN0b3J5IiwiQ29tbW9u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QUE0QnRJLElBQUksQ0FBQ3NJLGlCQUFqQztBQUNBbEcsTUFBQUEsT0FBTyxDQUFDd0MsTUFBUixHQUFpQjVFLElBQUksQ0FBQzRFLE1BQXRCO0FBQ0F4QyxNQUFBQSxPQUFPLENBQUN5RyxjQUFSLEdBQXlCN0ksSUFBSSxDQUFDNkksY0FBOUI7QUFDQXpHLE1BQUFBLE9BQU8sQ0FBQzBHLGFBQVIsR0FBd0I5SSxJQUFJLENBQUM4SSxhQUE3QjtBQUNBMUcsTUFBQUEsT0FBTyxDQUFDaEMsTUFBUixHQUFpQkosSUFBSSxDQUFDSSxNQUF0QjtBQUNBZ0MsTUFBQUEsT0FBTyxDQUFDMkcsV0FBUixHQUFzQi9JLElBQUksQ0FBQytJLFdBQTNCO0FBRUEsWUFBTTNHLE9BQU8sQ0FBQ0YsSUFBUixFQUFOO0FBRUFFLE1BQUFBLE9BQU8sQ0FBQ2hDLE1BQVIsR0FBaUIsV0FBakI7QUFDQSxZQUFNZ0MsT0FBTyxDQUFDRixJQUFSLEVBQU47O0FBRUEsVUFBSTtBQUNBLGNBQU1nSCx1QkFBY0MsWUFBZCxDQUEyQi9HLE9BQTNCLENBQU47QUFDSCxPQUZELENBRUUsT0FBT0osQ0FBUCxFQUFVO0FBQ1IsY0FBTUksT0FBTyxDQUFDc0YsTUFBUixFQUFOO0FBQ0EsY0FBTTFGLENBQU47QUFDSDs7QUFFRC9CLE1BQUFBLFFBQVEsQ0FBQ0UsT0FBVCxHQUFtQixtQkFBbkI7QUFDQUYsTUFBQUEsUUFBUSxDQUFDQyxVQUFULEdBQXNCLEdBQXRCO0FBQ0FELE1BQUFBLFFBQVEsQ0FBQ0csTUFBVCxHQUFrQixJQUFsQjtBQUVBLGFBQU9ILFFBQVA7QUFFSCxLQWhDRCxDQWdDRSxPQUFPK0IsQ0FBUCxFQUFVO0FBQ1IsWUFBTSxJQUFJbEIsS0FBSixDQUFVa0IsQ0FBVixDQUFOO0FBQ0g7QUFDSjs7QUEzZ0J3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqd3QgZnJvbSBcImpzb253ZWJ0b2tlblwiO1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gXCJiY3J5cHRqc1wiO1xyXG5pbXBvcnQgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcbmltcG9ydCBEcml2ZXJNb2RlbCBmcm9tIFwiLi4vZGF0YS1iYXNlL21vZGVscy9kcml2ZXJcIjtcclxuaW1wb3J0IFdhbGxldE1vZGVsIGZyb20gXCIuLi9kYXRhLWJhc2UvbW9kZWxzL3dhbGxldFwiO1xyXG5pbXBvcnQgV2FsbGV0SGlzdG9yeU1vZGVsIGZyb20gXCIuLi9kYXRhLWJhc2UvbW9kZWxzL3dhbGxldEhpc3RvcnlcIjtcclxuaW1wb3J0IHsgY2xlYXJTZWFyY2gsIGdldEFkbWluRmlsdGVyLCBlbmNyeXB0RGF0YSwgZGVjcnlwdERhdGEgfSBmcm9tIFwiLi4vdXRscy9faGVscGVyXCI7XHJcbmltcG9ydCB7IHVwbG9hZEZpbGUgfSBmcm9tIFwiLi4vdXRscy9faGVscGVyXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL3V0bHMvY29uZmlnXCI7XHJcbmltcG9ydCBDb21tb25TZXJ2aWNlIGZyb20gXCIuL0NvbW1vblNlcnZpY2VcIjtcclxuaW1wb3J0IHsgc2VuZFJlc2V0UGFzc3dvcmRNYWlsIH0gZnJvbSBcIi4uL3RocmlyZFBhcnR5L2VtYWlsU2VydmljZXMvZHJpdmVyL3NlbmRFbWFpbFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZSB7XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIGRyaXZlckxvZ2luKGRhdGEpIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG4gICAgICAgIGNvbnN0IGVtYWlsID0gZGF0YS5lbWFpbDtcclxuICAgICAgICBjb25zdCBwYXNzd29yZCA9IGRhdGEucGFzc3dvcmQ7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gYXdhaXQgRHJpdmVyTW9kZWwuZmluZE9uZSh7IGVtYWlsOiBlbWFpbCwgaXNEZWxldGVkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgbGV0IGlzUGFzc3dvcmRNYXRjaGVkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIG93bmVyLnBhc3N3b3JkKTtcclxuICAgICAgICAgICAgaWYgKCFpc1Bhc3N3b3JkTWF0Y2hlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBDcmVkZW50aWFsc1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IEpXVF9FWFBfRFVSID0gY29uZmlnLmp3dC5leHBEdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gand0LnNpZ24oeyBzdWI6IG93bmVyLl9pZC50b1N0cmluZygpLCBleHA6IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApICsgKChKV1RfRVhQX0RVUikgKiA2MCksIH0sIGNvbmZpZy5qd3Quc2VjcmV0S2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIW93bmVyLmVtYWlsVmVyaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gNDAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkVtYWlsIGlzIG5vdCB2ZXJpZmllZC4gUGxlYXNlIHZlcmlmeSBmcm9tIHRoZSBsaW5rIHNlbnQgdG8geW91ciBlbWFpbCEhXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvd25lci5pc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSA0MDE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiWW91ciBhY291bnQgaXMgYmxvY2tlZC4gUGxlYXNlIGNvbnRhY3QgYWRtaW5cIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkxvZ2dlZGluIHN1Y2Nlc3NmdWxseVwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhID0geyBhY2Nlc3NUb2tlbiB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgdmVyaWZ5RW1haWwoZW1haWwpIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBvd25lciA9IGF3YWl0IERyaXZlck1vZGVsLmZpbmRPbmUoeyBlbWFpbDogZW1haWwsIGlzRGVsZXRlZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgIGlmIChvd25lcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG93bmVyLmVtYWlsVmVyaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gXCJFbWFpbCBpcyBhbHJlYWR5IHZlcmlmaWVkXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyLmVtYWlsVmVyaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG93bmVyLnNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gXCJFbWFpbCBpcyB2ZXJpZmllZFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHBhdGhcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBnZW5Gb3JnZXRQYXNzd29yZFVybChlbWFpbCkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdFcnJvciEnLCBzdGF0dXM6IGZhbHNlIH07XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdHBsRGF0YSA9IGF3YWl0IERyaXZlck1vZGVsLmZpbmRPbmUoeyBlbWFpbDogZW1haWwsIGlzRGVsZXRlZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgIGlmICh0cGxEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lU3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIGNvbmZpZy5mb3JnZXRQYXNzRXhwVGltZSAqIDYwICogMTAwMDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVuY0tleSA9IGVuY3J5cHREYXRhKGVuY3J5cHREYXRhKHRpbWVTdGFtcCArICctLS0tLScgKyBlbWFpbCkpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgc2VuZFJlc2V0UGFzc3dvcmRNYWlsKHsga2V5OiBlbmNLZXksIGVtYWlsOiBlbWFpbCwgdmFsaWRGb3I6IGNvbmZpZy5mb3JnZXRQYXNzRXhwVGltZSB9KTtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkEgcmVzZXQgcGFzc3dvcmQgbGluayBoYXMgYmVlbiBzZW50IHRvIHlvdXIgZW1haWwuIFBsZWFzZSBjaGVjayBhbmQgcmVzZXQgeW91ciBwYXNzd29yZC5cIjtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBlbWFpbCBpcyBub3QgcmVnaXN0ZXJlZCB3aXRoIGFueSBhY2NvdW50XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgcmVzZXRQQXNzd29yZChrZXksIGRhdGEpIHtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdFcnJvciEnLCBzdGF0dXM6IGZhbHNlIH07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlY0tleSA9IGRlY3J5cHREYXRhKGRlY3J5cHREYXRhKGtleSkpO1xyXG4gICAgICAgICAgICBjb25zdCB0aW1lU3RhbXAgPSBkZWNLZXkuc3BsaXQoJy0tLS0tJylbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IGVtYWlsID0gZGVjS2V5LnNwbGl0KCctLS0tLScpWzFdO1xyXG4gICAgICAgICAgICBjb25zdCBjVGltZVN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0cGxEYXRhID0gYXdhaXQgRHJpdmVyTW9kZWwuZmluZE9uZSh7IGVtYWlsLCBpc0RlbGV0ZWQ6IGZhbHNlIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRpbWVTdGFtcCA+PSBjVGltZVN0YW1wKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHBsRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRwbERhdGEucGFzc3dvcmQgPSBkYXRhLnBhc3N3b3JkO1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRwbERhdGEuc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIlBhc3N3b3JkIGlzIHVwZGF0ZWQuIFRyeSBsb2dpbiBhZ2FuaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gXCJUaW1lIGV4cGlyZWRcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgbGlzdERyaXZlcihxdWVyeSwgcGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgaXNBbGwgPSBwYXJhbXMuaXNBbGwgPT09ICdBTEwnO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdEYXRhIG5vdCBmb3VuZCEnLFxyXG4gICAgICAgICAgICByZXN1bHQ6IHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgICAgICAgcGFnZTogcXVlcnkucGFnZSAqIDEgPiAwID8gcXVlcnkucGFnZSAqIDEgOiAxLFxyXG4gICAgICAgICAgICAgICAgbGltaXQ6IHF1ZXJ5LmxpbWl0ICogMSA+IDAgPyBxdWVyeS5saW1pdCAqIDEgOiAyMCxcclxuICAgICAgICAgICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdGF0dXM6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0ge1xyXG4gICAgICAgICAgICAgICAgX2lkOiBxdWVyeS5faWQsXHJcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gbmFtZToge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICRyZWdleDogJy4qJyArIChxdWVyeT8ua2V5IHx8ICcnKSArICcuKidcclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICAkb3I6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogeyAkcmVnZXg6ICcuKicgKyAocXVlcnk/LmtleSB8fCAnJykgKyAnLionIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWU6IHsgJHJlZ2V4OiAnLionICsgKHF1ZXJ5Py5rZXkgfHwgJycpICsgJy4qJyB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBpc0FwcHJvdmVkOiBxdWVyeS5pc0FwcHJvdmVkID8gKHF1ZXJ5LmlzQXBwcm92ZWQgPT09ICcxJyA/IHRydWUgOiBmYWxzZSkgOiAnJyxcclxuICAgICAgICAgICAgICAgIHZlaGljbGU6IHF1ZXJ5LnZlaGljbGVJZCA/IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHF1ZXJ5LnZlaGljbGVJZCkgOiAnJyxcclxuICAgICAgICAgICAgICAgIC4uLmdldEFkbWluRmlsdGVyKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFyU2VhcmNoKHNlYXJjaCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkYWdncmVnYXRlID0gW1xyXG4gICAgICAgICAgICAgICAgeyAkbWF0Y2g6IHNlYXJjaCB9LFxyXG4gICAgICAgICAgICAgICAgeyAkc29ydDogeyBfaWQ6IC0xIH0gfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9va3VwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICd3YWxsZXRzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxGaWVsZDogJ19pZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVpZ25GaWVsZDogJ2RyaXZlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzOiAnd2FsbGV0RGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVsaW5lOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2plY3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW1vdW50OiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIHsgJHVud2luZDogXCIkd2FsbGV0RGV0YWlsc1wiIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCIkcHJvamVjdFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlaGljbGU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFsdWs6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZlcklkOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuYW1lOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE5hbWU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaG9uZU5vOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RwVmVyaWZpZWQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvYjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgemlwY29kZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogeyAkY29uY2F0OiBbY29uZmlnLmFwcGxpY2F0aW9uRmlsZVVybCArICdkcml2ZXIvcGhvdG8vJywgXCIkcGhvdG9cIl0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiJHBob3RvXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZpbmdMaWNlbmNlTnVtYmVyOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkcml2aW5nTGljZW5jZU51bWJlckV4cGlyeURhdGU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZpbmdMaWNlbmNlSW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogeyAkY29uY2F0OiBbY29uZmlnLmFwcGxpY2F0aW9uRmlsZVVybCArICdkcml2ZXIvZG9jdW1lbnQvJywgXCIkZHJpdmluZ0xpY2VuY2VQaG90b1wiXSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCIkZHJpdmluZ0xpY2VuY2VQaG90b1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGhhck5vOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGhhckNhcmRJbWFnZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB7ICRjb25jYXQ6IFtjb25maWcuYXBwbGljYXRpb25GaWxlVXJsICsgJ2RyaXZlci9kb2N1bWVudC8nLCBcIiRhZGhhckNhcmRQaG90b1wiXSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCIkYWRoYXJDYXJkUGhvdG9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFuTm86IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhbkNhcmRJbWFnZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB7ICRjb25jYXQ6IFtjb25maWcuYXBwbGljYXRpb25GaWxlVXJsICsgJ2RyaXZlci9kb2N1bWVudC8nLCBcIiRwYW5DYXJkUGhvdG9cIl0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiJHBhbkNhcmRQaG90b1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWRnZU5vOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWRnZUltYWdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHsgJGNvbmNhdDogW2NvbmZpZy5hcHBsaWNhdGlvbkZpbGVVcmwgKyAnZHJpdmVyL2RvY3VtZW50LycsIFwiJGJhZGdlUGhvdG9cIl0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiJGJhZGdlUGhvdG9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBcHByb3ZlZDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhbGxldERldGFpbHM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHZlaGljbGVTZWFyY2ggPSB7XHJcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2VydmljZVR5cGU6IHF1ZXJ5LnNlcnZpY2VUeXBlID8gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQocXVlcnkuc2VydmljZVR5cGUpIDogJycsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjbGVhclNlYXJjaCh2ZWhpY2xlU2VhcmNoKTtcclxuICAgICAgICAgICAgJGFnZ3JlZ2F0ZS5wdXNoKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICRsb29rdXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogJ3ZlaGljbGVzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxGaWVsZDogJ3ZlaGljbGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlaWduRmllbGQ6ICdfaWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhczogJ3ZlaGljbGVEZXRhaWxzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGlwZWxpbmU6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgJG1hdGNoOiB2ZWhpY2xlU2VhcmNoIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2plY3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZVR5cGU6IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAkYWdncmVnYXRlLnB1c2goeyAkdW53aW5kOiBcIiR2ZWhpY2xlRGV0YWlsc1wiIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ZXIgPSBhd2FpdCBEcml2ZXJNb2RlbC5hZ2dyZWdhdGUoWy4uLiRhZ2dyZWdhdGUsIHsgJGNvdW50OiBcInRvdGFsXCIgfV0pO1xyXG4gICAgICAgICAgICByZXNwb25zZS5yZXN1bHQudG90YWwgPSBjb3VudGVyWzBdPy50b3RhbDtcclxuICAgICAgICAgICAgaWYgKGlzQWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5yZXN1bHQucGFnZSA9IDE7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5yZXN1bHQubGltaXQgPSByZXNwb25zZS5yZXN1bHQudG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5kYXRhID0gYXdhaXQgRHJpdmVyTW9kZWwuYWdncmVnYXRlKFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLiRhZ2dyZWdhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgeyAkbGltaXQ6IHJlc3BvbnNlLnJlc3VsdC5saW1pdCArIHJlc3BvbnNlLnJlc3VsdC5saW1pdCAqIChyZXNwb25zZS5yZXN1bHQucGFnZSAtIDEpIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyAkc2tpcDogcmVzcG9uc2UucmVzdWx0LmxpbWl0ICogKHJlc3BvbnNlLnJlc3VsdC5wYWdlIC0gMSkgfVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UucmVzdWx0LmRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gXCJEYXRhIGZldGNoZWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgc2F2ZURyaXZlcihkYXRhKSB7XHJcbiAgICAgICAgY29uc3QgX2lkID0gZGF0YS5faWQ7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Vycm9yIScsIHN0YXR1czogZmFsc2UgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdHBsRGF0YSA9IF9pZCA/IGF3YWl0IERyaXZlck1vZGVsLmZpbmRCeUlkKF9pZCkgOiBuZXcgRHJpdmVyTW9kZWwoKTtcclxuXHJcbiAgICAgICAgICAgIHRwbERhdGEudmVoaWNsZSA9IGRhdGEudmVoaWNsZTtcclxuICAgICAgICAgICAgdHBsRGF0YS5zdGF0ZSA9IGRhdGEuc3RhdGU7XHJcbiAgICAgICAgICAgIHRwbERhdGEuZGlzdHJpY3QgPSBkYXRhLmRpc3RyaWN0O1xyXG4gICAgICAgICAgICB0cGxEYXRhLnRhbHVrID0gZGF0YS50YWx1aztcclxuICAgICAgICAgICAgdHBsRGF0YS5kcml2ZXJJZCA9IGRhdGEuZHJpdmVySWQ7XHJcbiAgICAgICAgICAgIHRwbERhdGEuZmlyc3ROYW1lID0gZGF0YS5maXJzdE5hbWU7XHJcbiAgICAgICAgICAgIHRwbERhdGEubGFzdE5hbWUgPSBkYXRhLmxhc3ROYW1lO1xyXG4gICAgICAgICAgICB0cGxEYXRhLnBob25lTm8gPSBkYXRhLnBob25lTm87XHJcbiAgICAgICAgICAgIHRwbERhdGEuZW1haWwgPSBkYXRhLmVtYWlsO1xyXG4gICAgICAgICAgICAhZGF0YS5wYXNzd29yZCB8fCAodHBsRGF0YS5wYXNzd29yZCA9IGRhdGEucGFzc3dvcmQpO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmRvYiA9IGRhdGEuZG9iO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmFkZHJlc3MgPSBkYXRhLmFkZHJlc3M7XHJcbiAgICAgICAgICAgIHRwbERhdGEuemlwY29kZSA9IGRhdGEuemlwY29kZTtcclxuICAgICAgICAgICAgdHBsRGF0YS5waG90byA9IGF3YWl0IHVwbG9hZEZpbGUoZGF0YS5waG90bywgY29uZmlnLnVwbG9hZFBhdGhzLmRyaXZlci5waG90bywgRHJpdmVyTW9kZWwsICdwaG90bycsIF9pZCk7XHJcblxyXG4gICAgICAgICAgICB0cGxEYXRhLmRyaXZpbmdMaWNlbmNlTnVtYmVyID0gZGF0YS5kcml2aW5nTGljZW5jZU51bWJlcjtcclxuICAgICAgICAgICAgdHBsRGF0YS5kcml2aW5nTGljZW5jZU51bWJlckV4cGlyeURhdGUgPSBkYXRhLmRyaXZpbmdMaWNlbmNlTnVtYmVyRXhwaXJ5RGF0ZTtcclxuICAgICAgICAgICAgdHBsRGF0YS5kcml2aW5nTGljZW5jZVBob3RvID0gYXdhaXQgdXBsb2FkRmlsZShkYXRhLmRyaXZpbmdMaWNlbmNlUGhvdG8sIGNvbmZpZy51cGxvYWRQYXRocy5kcml2ZXIuZG9jdW1lbnQsIERyaXZlck1vZGVsLCAnZHJpdmluZ0xpY2VuY2VQaG90bycsIF9pZCk7XHJcblxyXG4gICAgICAgICAgICB0cGxEYXRhLmFkaGFyTm8gPSBkYXRhLmFkaGFyTm87XHJcbiAgICAgICAgICAgIHRwbERhdGEuYWRoYXJDYXJkUGhvdG8gPSBhd2FpdCB1cGxvYWRGaWxlKGRhdGEuYWRoYXJDYXJkUGhvdG8sIGNvbmZpZy51cGxvYWRQYXRocy5kcml2ZXIuZG9jdW1lbnQsIERyaXZlck1vZGVsLCAnYWRoYXJDYXJkUGhvdG8nLCBfaWQpO1xyXG5cclxuICAgICAgICAgICAgdHBsRGF0YS5wYW5ObyA9IGRhdGEucGFuTm87XHJcbiAgICAgICAgICAgIHRwbERhdGEucGFuQ2FyZFBob3RvID0gYXdhaXQgdXBsb2FkRmlsZShkYXRhLnBhbkNhcmRQaG90bywgY29uZmlnLnVwbG9hZFBhdGhzLmRyaXZlci5kb2N1bWVudCwgRHJpdmVyTW9kZWwsICdwYW5DYXJkUGhvdG8nLCBfaWQpO1xyXG5cclxuICAgICAgICAgICAgdHBsRGF0YS5iYWRnZU5vID0gZGF0YS5iYWRnZU5vO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmJhZGdlUGhvdG8gPSBhd2FpdCB1cGxvYWRGaWxlKGRhdGEuYmFkZ2VQaG90bywgY29uZmlnLnVwbG9hZFBhdGhzLmRyaXZlci5kb2N1bWVudCwgRHJpdmVyTW9kZWwsICdiYWRnZVBob3RvJywgX2lkKTtcclxuXHJcbiAgICAgICAgICAgIHRwbERhdGEub3duZXIgPSBkYXRhLm93bmVyO1xyXG5cclxuICAgICAgICAgICAgdHBsRGF0YS5pc0FwcHJvdmVkID0gZGF0YS5pc0FwcHJvdmVkO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmlzQWN0aXZlID0gZGF0YS5pc0FjdGl2ZTtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHRwbERhdGEuc2F2ZSgpO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmIChfaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmZpbmRPckNyZWF0ZVdhbGxldCh0cGxEYXRhLl9pZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRwbERhdGEucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IF9pZCA/IFwiRHJpdmVyIGlzIFVwZGF0ZWRcIiA6IFwiQSBuZXcgZHJpdmVyIGlzIGNyZWF0ZWRcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZGVsZXRlRHJpdmVyKF9pZCwgY29uZCkge1xyXG4gICAgICAgIGNvbmQgPSAhY29uZCA/IHt9IDogY29uZDtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCBEcml2ZXJNb2RlbC51cGRhdGVPbmUoeyBfaWQsIC4uLmNvbmQgfSwgeyBpc0RlbGV0ZWQ6IHRydWUgfSk7XHJcblxyXG4gICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gXCJEZWxldGVkIHN1Y2Nlc3NmdWxseVwiO1xyXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG5vdCBkZWxldGUuIFNvbWV0aGluZyB3ZW50IHdyb25nLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBkZWxldGVEcml2ZXJQZXJtYW5lbnQoY29uZCkge1xyXG4gICAgICAgIGF3YWl0IERyaXZlck1vZGVsLmRlbGV0ZU9uZSh7IC4uLmNvbmQgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIGZpbmRPckNyZWF0ZVdhbGxldChkcml2ZXJJZCkge1xyXG4gICAgICAgIGlmICghZHJpdmVySWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRHJpdmVyIGRvZXMgbm90IGV4aXN0XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgd2FsbGV0ID0gYXdhaXQgV2FsbGV0TW9kZWwuZmluZE9uZSh7IGRyaXZlcjogbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoZHJpdmVySWQpIH0pO1xyXG4gICAgICAgICAgICBpZiAoIXdhbGxldCkge1xyXG4gICAgICAgICAgICAgICAgd2FsbGV0ID0gbmV3IFdhbGxldE1vZGVsKCk7XHJcbiAgICAgICAgICAgICAgICB3YWxsZXQuYW1vdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIHdhbGxldC5kcml2ZXIgPSBkcml2ZXJJZDtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHdhbGxldC5zYXZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHdhbGxldDtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycm9yISBFaXRoZXIgd2FsbGV0IGRvZXMgbm90IGV4aXN0IG9yIGNhbiBub3QgYmUgY3JlYXRlZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyB3YWxsZXREYXRhTG9naWNBZG1pbihkYXRhKSB7XHJcbiAgICAgICAgY29uc3QgcmVzID0ge1xyXG4gICAgICAgICAgICAuLi5kYXRhLFxyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbklkOiAnJyxcclxuICAgICAgICAgICAgdHJhbnNhY3Rpb25UeXBlOiBkYXRhLnRyYW5zYWN0aW9uVHlwZSxcclxuICAgICAgICAgICAgdHJhbnNhY3Rpb25NZXRob2Q6ICdieUFkbWluJyxcclxuICAgICAgICAgICAgYW1vdW50OiBkYXRhLmFtb3VudCxcclxuICAgICAgICAgICAgc3RhdHVzOiAncGVuZGluZydcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdGVtcERhdGEgPSBhd2FpdCBXYWxsZXRIaXN0b3J5TW9kZWwuZmluZE9uZSgpLnNvcnQoeyB0cmFuc2FjdGlvbklkOiAtMSB9KTtcclxuICAgICAgICBpZiAodGVtcERhdGE/LnRyYW5zYWN0aW9uSWQpIHtcclxuICAgICAgICAgICAgbGV0IHRyYW5zYWN0aW9uSWQgPSB0ZW1wRGF0YS50cmFuc2FjdGlvbklkO1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbklkICs9IDE7XHJcbiAgICAgICAgICAgIHJlcy50cmFuc2FjdGlvbklkID0gcGFyc2VJbnQodGVtcERhdGEudHJhbnNhY3Rpb25JZCkgKyAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlcy50cmFuc2FjdGlvbklkID0gcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwMDAwMDAwMDAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBsaXN0V2FsbGV0SGlzdG9yeShxdWVyeSwgcGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgaXNBbGwgPSBwYXJhbXMuaXNBbGwgPT09ICdBTEwnO1xyXG4gICAgICAgIGNvbnN0IGRyaXZlcklkID0gcXVlcnkuZHJpdmVySWQ7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0RhdGEgbm90IGZvdW5kIScsXHJcbiAgICAgICAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICBwYWdlOiBxdWVyeS5wYWdlICogMSA+IDAgPyBxdWVyeS5wYWdlICogMSA6IDEsXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogcXVlcnkubGltaXQgKiAxID4gMCA/IHF1ZXJ5LmxpbWl0ICogMSA6IDIwLFxyXG4gICAgICAgICAgICAgICAgdG90YWw6IDAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YXR1czogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB3YWxsZXQgPSBhd2FpdCB0aGlzLmZpbmRPckNyZWF0ZVdhbGxldChkcml2ZXJJZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCA9IHtcclxuICAgICAgICAgICAgICAgIHdhbGxldDogd2FsbGV0Ll9pZCxcclxuICAgICAgICAgICAgICAgIF9pZDogcXVlcnkuX2lkLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25JZDogcXVlcnk/LmtleSA/IHBhcnNlSW50KHF1ZXJ5Py5rZXkpIDogJycsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2FjdGlvblR5cGU6IHF1ZXJ5LnRyYW5zYWN0aW9uVHlwZSB8fCAnJyxcclxuICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uTWV0aG9kOiBxdWVyeS50cmFuc2FjdGlvbk1ldGhvZCB8fCAnJyxcclxuICAgICAgICAgICAgICAgIHN0YXR1czogcXVlcnkuc3RhdHVzIHx8ICcnLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY2xlYXJTZWFyY2goc2VhcmNoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0ICRhZ2dyZWdhdGUgPSBbXHJcbiAgICAgICAgICAgICAgICB7ICRtYXRjaDogc2VhcmNoIH0sXHJcbiAgICAgICAgICAgICAgICB7ICRzb3J0OiB7IF9pZDogLTEgfSB9LFxyXG4gICAgICAgICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICRsb29rdXA6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZnJvbTogJ2RyaXZlcnMnLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBsb2NhbEZpZWxkOiAnZHJpdmVyJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZm9yZWlnbkZpZWxkOiAnX2lkJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgYXM6ICdkcml2ZXJEZXRhaWxzJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgcGlwZWxpbmU6IFtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAkcHJvamVjdDoge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBuYW1lOiAxXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcIiRwcm9qZWN0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25JZDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25UeXBlOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbk1ldGhvZDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW1vdW50OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0Ftb3VudDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEFtb3VudDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHJpdmVyRGV0YWlsczogMVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyB7ICR1bndpbmQ6IFwiJGRyaXZlckRldGFpbHNcIiB9XHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb3VudGVyID0gYXdhaXQgV2FsbGV0SGlzdG9yeU1vZGVsLmFnZ3JlZ2F0ZShbLi4uJGFnZ3JlZ2F0ZSwgeyAkY291bnQ6IFwidG90YWxcIiB9XSk7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC50b3RhbCA9IGNvdW50ZXJbMF0/LnRvdGFsO1xyXG4gICAgICAgICAgICBpZiAoaXNBbGwpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5wYWdlID0gMTtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5saW1pdCA9IHJlc3BvbnNlLnJlc3VsdC50b3RhbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LmRhdGEgPSBhd2FpdCBXYWxsZXRIaXN0b3J5TW9kZWwuYWdncmVnYXRlKFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLiRhZ2dyZWdhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgeyAkbGltaXQ6IHJlc3BvbnNlLnJlc3VsdC5saW1pdCArIHJlc3BvbnNlLnJlc3VsdC5saW1pdCAqIChyZXNwb25zZS5yZXN1bHQucGFnZSAtIDEpIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyAkc2tpcDogcmVzcG9uc2UucmVzdWx0LmxpbWl0ICogKHJlc3BvbnNlLnJlc3VsdC5wYWdlIC0gMSkgfVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UucmVzdWx0LmRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gXCJEYXRhIGZldGNoZWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlV2FsbGV0SGlzdG9yeShkYXRhKSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Vycm9yIScsIHN0YXR1czogZmFsc2UgfTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB3YWxsZXQgPSBhd2FpdCB0aGlzLmZpbmRPckNyZWF0ZVdhbGxldChkYXRhLmRyaXZlcklkKTtcclxuICAgICAgICAgICAgY29uc3QgdHBsRGF0YSA9IG5ldyBXYWxsZXRIaXN0b3J5TW9kZWwoKTtcclxuXHJcbiAgICAgICAgICAgIHRwbERhdGEud2FsbGV0ID0gd2FsbGV0Ll9pZDtcclxuICAgICAgICAgICAgdHBsRGF0YS50cmFuc2FjdGlvbklkID0gZGF0YS50cmFuc2FjdGlvbklkO1xyXG4gICAgICAgICAgICB0cGxEYXRhLnRyYW5zYWN0aW9uVHlwZSA9IGRhdGEudHJhbnNhY3Rpb25UeXBlO1xyXG4gICAgICAgICAgICB0cGxEYXRhLnRyYW5zYWN0aW9uTWV0aG9kID0gZGF0YS50cmFuc2FjdGlvbk1ldGhvZDtcclxuICAgICAgICAgICAgdHBsRGF0YS5hbW91bnQgPSBkYXRhLmFtb3VudDtcclxuICAgICAgICAgICAgdHBsRGF0YS5wcmV2aW91c0Ftb3VudCA9IGRhdGEucHJldmlvdXNBbW91bnQ7XHJcbiAgICAgICAgICAgIHRwbERhdGEuY3VycmVudEFtb3VudCA9IGRhdGEuY3VycmVudEFtb3VudDtcclxuICAgICAgICAgICAgdHBsRGF0YS5zdGF0dXMgPSBkYXRhLnN0YXR1cztcclxuICAgICAgICAgICAgdHBsRGF0YS5kZXNjcmlwdGlvbiA9IGRhdGEuZGVzY3JpcHRpb247XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0cGxEYXRhLnNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHRwbERhdGEuc3RhdHVzID0gJ2NvbXBsZXRlZCc7XHJcbiAgICAgICAgICAgIGF3YWl0IHRwbERhdGEuc2F2ZSgpO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IENvbW1vblNlcnZpY2UudXBkYXRlV2FsbGV0KHRwbERhdGEpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0cGxEYXRhLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiV2FsbGV0IGlzIHVwZGF0ZWRcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=