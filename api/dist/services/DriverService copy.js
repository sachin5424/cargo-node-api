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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Ecml2ZXJTZXJ2aWNlIGNvcHkuanMiXSwibmFtZXMiOlsiU2VydmljZSIsImRyaXZlckxvZ2luIiwiZGF0YSIsInJlc3BvbnNlIiwic3RhdHVzQ29kZSIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJlbWFpbCIsInBhc3N3b3JkIiwib3duZXIiLCJEcml2ZXJNb2RlbCIsImZpbmRPbmUiLCJpc0RlbGV0ZWQiLCJpc1Bhc3N3b3JkTWF0Y2hlZCIsImJjcnlwdCIsImNvbXBhcmUiLCJFcnJvciIsIkpXVF9FWFBfRFVSIiwiY29uZmlnIiwiand0IiwiZXhwRHVyYXRpb24iLCJhY2Nlc3NUb2tlbiIsInNpZ24iLCJzdWIiLCJfaWQiLCJ0b1N0cmluZyIsImV4cCIsIk1hdGgiLCJmbG9vciIsIkRhdGUiLCJub3ciLCJzZWNyZXRLZXkiLCJlbWFpbFZlcmlmaWVkIiwiaXNBY3RpdmUiLCJlIiwidmVyaWZ5RW1haWwiLCJzYXZlIiwiZ2VuRm9yZ2V0UGFzc3dvcmRVcmwiLCJ0cGxEYXRhIiwidGltZVN0YW1wIiwiZ2V0VGltZSIsImZvcmdldFBhc3NFeHBUaW1lIiwiZW5jS2V5Iiwia2V5IiwidmFsaWRGb3IiLCJyZXNldFBBc3N3b3JkIiwiZGVjS2V5Iiwic3BsaXQiLCJjVGltZVN0YW1wIiwibGlzdERyaXZlciIsInF1ZXJ5IiwicGFyYW1zIiwiaXNBbGwiLCJyZXN1bHQiLCJwYWdlIiwibGltaXQiLCJ0b3RhbCIsInNlYXJjaCIsIm5hbWUiLCIkcmVnZXgiLCJpc0FwcHJvdmVkIiwidmVoaWNsZSIsInZlaGljbGVJZCIsIm1vbmdvb3NlIiwiVHlwZXMiLCJPYmplY3RJZCIsIiRhZ2dyZWdhdGUiLCIkbWF0Y2giLCIkc29ydCIsIiRsb29rdXAiLCJmcm9tIiwibG9jYWxGaWVsZCIsImZvcmVpZ25GaWVsZCIsImFzIiwicGlwZWxpbmUiLCIkcHJvamVjdCIsImFtb3VudCIsInN0YXRlIiwiZGlzdHJpY3QiLCJ0YWx1ayIsImRyaXZlcklkIiwicGhvbmVObyIsIm90cFZlcmlmaWVkIiwiZG9iIiwiYWRkcmVzcyIsInppcGNvZGUiLCJpbWFnZSIsInVybCIsIiRjb25jYXQiLCJhcHBsaWNhdGlvbkZpbGVVcmwiLCJkcml2aW5nTGljZW5jZU51bWJlciIsImRyaXZpbmdMaWNlbmNlTnVtYmVyRXhwaXJ5RGF0ZSIsImRyaXZpbmdMaWNlbmNlSW1hZ2UiLCJhZGhhck5vIiwiYWRoYXJDYXJkSW1hZ2UiLCJwYW5ObyIsInBhbkNhcmRJbWFnZSIsImJhZGdlTm8iLCJiYWRnZUltYWdlIiwid2FsbGV0RGV0YWlscyIsInZlaGljbGVTZWFyY2giLCJzZXJ2aWNlVHlwZSIsInB1c2giLCIkdW53aW5kIiwiY291bnRlciIsImFnZ3JlZ2F0ZSIsIiRjb3VudCIsIiRsaW1pdCIsIiRza2lwIiwibGVuZ3RoIiwic2F2ZURyaXZlciIsImZpbmRCeUlkIiwicGhvdG8iLCJ1cGxvYWRQYXRocyIsImRyaXZlciIsImRyaXZpbmdMaWNlbmNlUGhvdG8iLCJkb2N1bWVudCIsImFkaGFyQ2FyZFBob3RvIiwicGFuQ2FyZFBob3RvIiwiYmFkZ2VQaG90byIsImZpbmRPckNyZWF0ZVdhbGxldCIsInJlbW92ZSIsImRlbGV0ZURyaXZlciIsImNvbmQiLCJ1cGRhdGVPbmUiLCJkZWxldGVEcml2ZXJQZXJtYW5lbnQiLCJkZWxldGVPbmUiLCJ3YWxsZXQiLCJXYWxsZXRNb2RlbCIsIndhbGxldERhdGFMb2dpY0FkbWluIiwicmVzIiwidHJhbnNhY3Rpb25JZCIsInRyYW5zYWN0aW9uVHlwZSIsInRyYW5zYWN0aW9uTWV0aG9kIiwidGVtcERhdGEiLCJXYWxsZXRIaXN0b3J5TW9kZWwiLCJzb3J0IiwicGFyc2VJbnQiLCJyYW5kb20iLCJsaXN0V2FsbGV0SGlzdG9yeSIsInByZXZpb3VzQW1vdW50IiwiY3VycmVudEFtb3VudCIsImRlc2NyaXB0aW9uIiwiZHJpdmVyRGV0YWlscyIsInNhdmVXYWxsZXRIaXN0b3J5IiwiQ29tbW9uU2VydmljZSIsInVwZGF0ZVdhbGxldCJd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V0FBUixHQUFzQjVJLElBQUksQ0FBQzRJLFdBQTNCO0FBRUEsWUFBTXhHLE9BQU8sQ0FBQ0YsSUFBUixFQUFOO0FBRUFFLE1BQUFBLE9BQU8sQ0FBQ2hDLE1BQVIsR0FBaUIsV0FBakI7QUFDQSxZQUFNZ0MsT0FBTyxDQUFDRixJQUFSLEVBQU47O0FBRUEsVUFBSTtBQUNBLGNBQU02Ryx1QkFBY0MsWUFBZCxDQUEyQjVHLE9BQTNCLENBQU47QUFDSCxPQUZELENBRUUsT0FBT0osQ0FBUCxFQUFVO0FBQ1IsY0FBTUksT0FBTyxDQUFDbUYsTUFBUixFQUFOO0FBQ0EsY0FBTXZGLENBQU47QUFDSDs7QUFFRC9CLE1BQUFBLFFBQVEsQ0FBQ0UsT0FBVCxHQUFtQixtQkFBbkI7QUFDQUYsTUFBQUEsUUFBUSxDQUFDQyxVQUFULEdBQXNCLEdBQXRCO0FBQ0FELE1BQUFBLFFBQVEsQ0FBQ0csTUFBVCxHQUFrQixJQUFsQjtBQUVBLGFBQU9ILFFBQVA7QUFFSCxLQWhDRCxDQWdDRSxPQUFPK0IsQ0FBUCxFQUFVO0FBQ1IsWUFBTSxJQUFJbEIsS0FBSixDQUFVa0IsQ0FBVixDQUFOO0FBQ0g7QUFDSjs7QUFsZ0J3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqd3QgZnJvbSBcImpzb253ZWJ0b2tlblwiO1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gXCJiY3J5cHRqc1wiO1xyXG5pbXBvcnQgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcbmltcG9ydCBEcml2ZXJNb2RlbCBmcm9tIFwiLi4vZGF0YS1iYXNlL21vZGVscy9kcml2ZXJcIjtcclxuaW1wb3J0IFdhbGxldE1vZGVsIGZyb20gXCIuLi9kYXRhLWJhc2UvbW9kZWxzL3dhbGxldFwiO1xyXG5pbXBvcnQgV2FsbGV0SGlzdG9yeU1vZGVsIGZyb20gXCIuLi9kYXRhLWJhc2UvbW9kZWxzL3dhbGxldEhpc3RvcnlcIjtcclxuaW1wb3J0IHsgY2xlYXJTZWFyY2gsIGdldEFkbWluRmlsdGVyLCBlbmNyeXB0RGF0YSwgZGVjcnlwdERhdGEgfSBmcm9tIFwiLi4vdXRscy9faGVscGVyXCI7XHJcbmltcG9ydCB7IHVwbG9hZEZpbGUgfSBmcm9tIFwiLi4vdXRscy9faGVscGVyXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uL3V0bHMvY29uZmlnXCI7XHJcbmltcG9ydCBDb21tb25TZXJ2aWNlIGZyb20gXCIuL0NvbW1vblNlcnZpY2VcIjtcclxuaW1wb3J0IHsgc2VuZFJlc2V0UGFzc3dvcmRNYWlsIH0gZnJvbSBcIi4uL3RocmlyZFBhcnR5L2VtYWlsU2VydmljZXMvZHJpdmVyL3NlbmRFbWFpbFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZSB7XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIGRyaXZlckxvZ2luKGRhdGEpIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG4gICAgICAgIGNvbnN0IGVtYWlsID0gZGF0YS5lbWFpbDtcclxuICAgICAgICBjb25zdCBwYXNzd29yZCA9IGRhdGEucGFzc3dvcmQ7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gYXdhaXQgRHJpdmVyTW9kZWwuZmluZE9uZSh7IGVtYWlsOiBlbWFpbCwgaXNEZWxldGVkOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgbGV0IGlzUGFzc3dvcmRNYXRjaGVkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIG93bmVyLnBhc3N3b3JkKTtcclxuICAgICAgICAgICAgaWYgKCFpc1Bhc3N3b3JkTWF0Y2hlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBDcmVkZW50aWFsc1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IEpXVF9FWFBfRFVSID0gY29uZmlnLmp3dC5leHBEdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gand0LnNpZ24oeyBzdWI6IG93bmVyLl9pZC50b1N0cmluZygpLCBleHA6IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApICsgKChKV1RfRVhQX0RVUikgKiA2MCksIH0sIGNvbmZpZy5qd3Quc2VjcmV0S2V5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIW93bmVyLmVtYWlsVmVyaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gNDAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkVtYWlsIGlzIG5vdCB2ZXJpZmllZC4gUGxlYXNlIHZlcmlmeSBmcm9tIHRoZSBsaW5rIHNlbnQgdG8geW91ciBlbWFpbCEhXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFvd25lci5pc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSA0MDE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiWW91ciBhY291bnQgaXMgYmxvY2tlZC4gUGxlYXNlIGNvbnRhY3QgYWRtaW5cIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkxvZ2dlZGluIHN1Y2Nlc3NmdWxseVwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhID0geyBhY2Nlc3NUb2tlbiB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgdmVyaWZ5RW1haWwoZW1haWwpIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBvd25lciA9IGF3YWl0IERyaXZlck1vZGVsLmZpbmRPbmUoeyBlbWFpbDogZW1haWwsIGlzRGVsZXRlZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgIGlmIChvd25lcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG93bmVyLmVtYWlsVmVyaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gXCJFbWFpbCBpcyBhbHJlYWR5IHZlcmlmaWVkXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyLmVtYWlsVmVyaWZpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IG93bmVyLnNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gXCJFbWFpbCBpcyB2ZXJpZmllZFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHBhdGhcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBnZW5Gb3JnZXRQYXNzd29yZFVybChlbWFpbCkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdFcnJvciEnLCBzdGF0dXM6IGZhbHNlIH07XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgdHBsRGF0YSA9IGF3YWl0IERyaXZlck1vZGVsLmZpbmRPbmUoeyBlbWFpbDogZW1haWwsIGlzRGVsZXRlZDogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgIGlmICh0cGxEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lU3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIGNvbmZpZy5mb3JnZXRQYXNzRXhwVGltZSAqIDYwICogMTAwMDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVuY0tleSA9IGVuY3J5cHREYXRhKGVuY3J5cHREYXRhKHRpbWVTdGFtcCArICctLS0tLScgKyBlbWFpbCkpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgc2VuZFJlc2V0UGFzc3dvcmRNYWlsKHsga2V5OiBlbmNLZXksIGVtYWlsOiBlbWFpbCwgdmFsaWRGb3I6IGNvbmZpZy5mb3JnZXRQYXNzRXhwVGltZSB9KTtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkEgcmVzZXQgcGFzc3dvcmQgbGluayBoYXMgYmVlbiBzZW50IHRvIHlvdXIgZW1haWwuIFBsZWFzZSBjaGVjayBhbmQgcmVzZXQgeW91ciBwYXNzd29yZC5cIjtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBlbWFpbCBpcyBub3QgcmVnaXN0ZXJlZCB3aXRoIGFueSBhY2NvdW50XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgcmVzZXRQQXNzd29yZChrZXksIGRhdGEpIHtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdFcnJvciEnLCBzdGF0dXM6IGZhbHNlIH07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlY0tleSA9IGRlY3J5cHREYXRhKGRlY3J5cHREYXRhKGtleSkpO1xyXG4gICAgICAgICAgICBjb25zdCB0aW1lU3RhbXAgPSBkZWNLZXkuc3BsaXQoJy0tLS0tJylbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IGVtYWlsID0gZGVjS2V5LnNwbGl0KCctLS0tLScpWzFdO1xyXG4gICAgICAgICAgICBjb25zdCBjVGltZVN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0cGxEYXRhID0gYXdhaXQgRHJpdmVyTW9kZWwuZmluZE9uZSh7IGVtYWlsLCBpc0RlbGV0ZWQ6IGZhbHNlIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRpbWVTdGFtcCA+PSBjVGltZVN0YW1wKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHBsRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRwbERhdGEucGFzc3dvcmQgPSBkYXRhLnBhc3N3b3JkO1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRwbERhdGEuc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIlBhc3N3b3JkIGlzIHVwZGF0ZWQuIFRyeSBsb2dpbiBhZ2FuaW5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlID0gMjAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gXCJUaW1lIGV4cGlyZWRcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgbGlzdERyaXZlcihxdWVyeSwgcGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgaXNBbGwgPSBwYXJhbXMuaXNBbGwgPT09ICdBTEwnO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdEYXRhIG5vdCBmb3VuZCEnLFxyXG4gICAgICAgICAgICByZXN1bHQ6IHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgICAgICAgcGFnZTogcXVlcnkucGFnZSAqIDEgPiAwID8gcXVlcnkucGFnZSAqIDEgOiAxLFxyXG4gICAgICAgICAgICAgICAgbGltaXQ6IHF1ZXJ5LmxpbWl0ICogMSA+IDAgPyBxdWVyeS5saW1pdCAqIDEgOiAyMCxcclxuICAgICAgICAgICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdGF0dXM6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0ge1xyXG4gICAgICAgICAgICAgICAgX2lkOiBxdWVyeS5faWQsXHJcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAgICAgICRyZWdleDogJy4qJyArIChxdWVyeT8ua2V5IHx8ICcnKSArICcuKidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBpc0FwcHJvdmVkOiBxdWVyeS5pc0FwcHJvdmVkID8gKHF1ZXJ5LmlzQXBwcm92ZWQgPT09ICcxJyA/IHRydWUgOiBmYWxzZSkgOiAnJyxcclxuICAgICAgICAgICAgICAgIHZlaGljbGU6IHF1ZXJ5LnZlaGljbGVJZCA/IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHF1ZXJ5LnZlaGljbGVJZCkgOiAnJyxcclxuICAgICAgICAgICAgICAgIC4uLmdldEFkbWluRmlsdGVyKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFyU2VhcmNoKHNlYXJjaCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkYWdncmVnYXRlID0gW1xyXG4gICAgICAgICAgICAgICAgeyAkbWF0Y2g6IHNlYXJjaCB9LFxyXG4gICAgICAgICAgICAgICAgeyAkc29ydDogeyBfaWQ6IC0xIH0gfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9va3VwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICd3YWxsZXRzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxGaWVsZDogJ19pZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVpZ25GaWVsZDogJ2RyaXZlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzOiAnd2FsbGV0RGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVsaW5lOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2plY3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW1vdW50OiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIHsgJHVud2luZDogXCIkd2FsbGV0RGV0YWlsc1wiIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCIkcHJvamVjdFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlaGljbGU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXN0cmljdDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFsdWs6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZlcklkOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXJzdE5hbWU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxhc3ROYW1lOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaG9uZU5vOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3RwVmVyaWZpZWQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvYjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzczogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgemlwY29kZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogeyAkY29uY2F0OiBbY29uZmlnLmFwcGxpY2F0aW9uRmlsZVVybCArICdkcml2ZXIvcGhvdG8vJywgXCIkcGhvdG9cIl0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiJHBob3RvXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZpbmdMaWNlbmNlTnVtYmVyOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkcml2aW5nTGljZW5jZU51bWJlckV4cGlyeURhdGU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZpbmdMaWNlbmNlSW1hZ2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogeyAkY29uY2F0OiBbY29uZmlnLmFwcGxpY2F0aW9uRmlsZVVybCArICdkcml2ZXIvZG9jdW1lbnQvJywgXCIkZHJpdmluZ0xpY2VuY2VQaG90b1wiXSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCIkZHJpdmluZ0xpY2VuY2VQaG90b1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGhhck5vOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGhhckNhcmRJbWFnZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB7ICRjb25jYXQ6IFtjb25maWcuYXBwbGljYXRpb25GaWxlVXJsICsgJ2RyaXZlci9kb2N1bWVudC8nLCBcIiRhZGhhckNhcmRQaG90b1wiXSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCIkYWRoYXJDYXJkUGhvdG9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFuTm86IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhbkNhcmRJbWFnZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB7ICRjb25jYXQ6IFtjb25maWcuYXBwbGljYXRpb25GaWxlVXJsICsgJ2RyaXZlci9kb2N1bWVudC8nLCBcIiRwYW5DYXJkUGhvdG9cIl0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiJHBhbkNhcmRQaG90b1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWRnZU5vOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWRnZUltYWdlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHsgJGNvbmNhdDogW2NvbmZpZy5hcHBsaWNhdGlvbkZpbGVVcmwgKyAnZHJpdmVyL2RvY3VtZW50LycsIFwiJGJhZGdlUGhvdG9cIl0gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiJGJhZGdlUGhvdG9cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBcHByb3ZlZDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhbGxldERldGFpbHM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHZlaGljbGVTZWFyY2ggPSB7XHJcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2VydmljZVR5cGU6IHF1ZXJ5LnNlcnZpY2VUeXBlID8gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQocXVlcnkuc2VydmljZVR5cGUpIDogJycsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjbGVhclNlYXJjaCh2ZWhpY2xlU2VhcmNoKTtcclxuICAgICAgICAgICAgJGFnZ3JlZ2F0ZS5wdXNoKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICRsb29rdXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogJ3ZlaGljbGVzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxGaWVsZDogJ3ZlaGljbGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlaWduRmllbGQ6ICdfaWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhczogJ3ZlaGljbGVEZXRhaWxzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGlwZWxpbmU6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgJG1hdGNoOiB2ZWhpY2xlU2VhcmNoIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2plY3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRhZ2dyZWdhdGUucHVzaCh7ICR1bndpbmQ6IFwiJHZlaGljbGVEZXRhaWxzXCIgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgY29uc3QgY291bnRlciA9IGF3YWl0IERyaXZlck1vZGVsLmFnZ3JlZ2F0ZShbLi4uJGFnZ3JlZ2F0ZSwgeyAkY291bnQ6IFwidG90YWxcIiB9XSk7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC50b3RhbCA9IGNvdW50ZXJbMF0/LnRvdGFsO1xyXG4gICAgICAgICAgICBpZiAoaXNBbGwpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5wYWdlID0gMTtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5saW1pdCA9IHJlc3BvbnNlLnJlc3VsdC50b3RhbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LmRhdGEgPSBhd2FpdCBEcml2ZXJNb2RlbC5hZ2dyZWdhdGUoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uJGFnZ3JlZ2F0ZSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRsaW1pdDogcmVzcG9uc2UucmVzdWx0LmxpbWl0ICsgcmVzcG9uc2UucmVzdWx0LmxpbWl0ICogKHJlc3BvbnNlLnJlc3VsdC5wYWdlIC0gMSkgfSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRza2lwOiByZXNwb25zZS5yZXN1bHQubGltaXQgKiAocmVzcG9uc2UucmVzdWx0LnBhZ2UgLSAxKSB9XHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXN1bHQuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkRhdGEgZmV0Y2hlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlRHJpdmVyKGRhdGEpIHtcclxuICAgICAgICBjb25zdCBfaWQgPSBkYXRhLl9pZDtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0cGxEYXRhID0gX2lkID8gYXdhaXQgRHJpdmVyTW9kZWwuZmluZEJ5SWQoX2lkKSA6IG5ldyBEcml2ZXJNb2RlbCgpO1xyXG5cclxuICAgICAgICAgICAgdHBsRGF0YS52ZWhpY2xlID0gZGF0YS52ZWhpY2xlO1xyXG4gICAgICAgICAgICB0cGxEYXRhLnN0YXRlID0gZGF0YS5zdGF0ZTtcclxuICAgICAgICAgICAgdHBsRGF0YS5kaXN0cmljdCA9IGRhdGEuZGlzdHJpY3Q7XHJcbiAgICAgICAgICAgIHRwbERhdGEudGFsdWsgPSBkYXRhLnRhbHVrO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmRyaXZlcklkID0gZGF0YS5kcml2ZXJJZDtcclxuICAgICAgICAgICAgdHBsRGF0YS5uYW1lID0gZGF0YS5uYW1lO1xyXG4gICAgICAgICAgICAvLyB0cGxEYXRhLmxhc3ROYW1lID0gZGF0YS5sYXN0TmFtZTtcclxuICAgICAgICAgICAgdHBsRGF0YS5waG9uZU5vID0gZGF0YS5waG9uZU5vO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmVtYWlsID0gZGF0YS5lbWFpbDtcclxuICAgICAgICAgICAgIWRhdGEucGFzc3dvcmQgfHwgKHRwbERhdGEucGFzc3dvcmQgPSBkYXRhLnBhc3N3b3JkKTtcclxuICAgICAgICAgICAgdHBsRGF0YS5kb2IgPSBkYXRhLmRvYjtcclxuICAgICAgICAgICAgdHBsRGF0YS5hZGRyZXNzID0gZGF0YS5hZGRyZXNzO1xyXG4gICAgICAgICAgICB0cGxEYXRhLnppcGNvZGUgPSBkYXRhLnppcGNvZGU7XHJcbiAgICAgICAgICAgIHRwbERhdGEucGhvdG8gPSBhd2FpdCB1cGxvYWRGaWxlKGRhdGEucGhvdG8sIGNvbmZpZy51cGxvYWRQYXRocy5kcml2ZXIucGhvdG8sIERyaXZlck1vZGVsLCAncGhvdG8nLCBfaWQpO1xyXG5cclxuICAgICAgICAgICAgdHBsRGF0YS5kcml2aW5nTGljZW5jZU51bWJlciA9IGRhdGEuZHJpdmluZ0xpY2VuY2VOdW1iZXI7XHJcbiAgICAgICAgICAgIHRwbERhdGEuZHJpdmluZ0xpY2VuY2VOdW1iZXJFeHBpcnlEYXRlID0gZGF0YS5kcml2aW5nTGljZW5jZU51bWJlckV4cGlyeURhdGU7XHJcbiAgICAgICAgICAgIHRwbERhdGEuZHJpdmluZ0xpY2VuY2VQaG90byA9IGF3YWl0IHVwbG9hZEZpbGUoZGF0YS5kcml2aW5nTGljZW5jZVBob3RvLCBjb25maWcudXBsb2FkUGF0aHMuZHJpdmVyLmRvY3VtZW50LCBEcml2ZXJNb2RlbCwgJ2RyaXZpbmdMaWNlbmNlUGhvdG8nLCBfaWQpO1xyXG5cclxuICAgICAgICAgICAgdHBsRGF0YS5hZGhhck5vID0gZGF0YS5hZGhhck5vO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmFkaGFyQ2FyZFBob3RvID0gYXdhaXQgdXBsb2FkRmlsZShkYXRhLmFkaGFyQ2FyZFBob3RvLCBjb25maWcudXBsb2FkUGF0aHMuZHJpdmVyLmRvY3VtZW50LCBEcml2ZXJNb2RlbCwgJ2FkaGFyQ2FyZFBob3RvJywgX2lkKTtcclxuXHJcbiAgICAgICAgICAgIHRwbERhdGEucGFuTm8gPSBkYXRhLnBhbk5vO1xyXG4gICAgICAgICAgICB0cGxEYXRhLnBhbkNhcmRQaG90byA9IGF3YWl0IHVwbG9hZEZpbGUoZGF0YS5wYW5DYXJkUGhvdG8sIGNvbmZpZy51cGxvYWRQYXRocy5kcml2ZXIuZG9jdW1lbnQsIERyaXZlck1vZGVsLCAncGFuQ2FyZFBob3RvJywgX2lkKTtcclxuXHJcbiAgICAgICAgICAgIHRwbERhdGEuYmFkZ2VObyA9IGRhdGEuYmFkZ2VObztcclxuICAgICAgICAgICAgdHBsRGF0YS5iYWRnZVBob3RvID0gYXdhaXQgdXBsb2FkRmlsZShkYXRhLmJhZGdlUGhvdG8sIGNvbmZpZy51cGxvYWRQYXRocy5kcml2ZXIuZG9jdW1lbnQsIERyaXZlck1vZGVsLCAnYmFkZ2VQaG90bycsIF9pZCk7XHJcblxyXG4gICAgICAgICAgICB0cGxEYXRhLm93bmVyID0gZGF0YS5vd25lcjtcclxuXHJcbiAgICAgICAgICAgIHRwbERhdGEuaXNBcHByb3ZlZCA9IGRhdGEuaXNBcHByb3ZlZDtcclxuICAgICAgICAgICAgdHBsRGF0YS5pc0FjdGl2ZSA9IGRhdGEuaXNBY3RpdmU7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0cGxEYXRhLnNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5maW5kT3JDcmVhdGVXYWxsZXQodHBsRGF0YS5faWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0cGxEYXRhLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBfaWQgPyBcIkRyaXZlciBpcyBVcGRhdGVkXCIgOiBcIkEgbmV3IGRyaXZlciBpcyBjcmVhdGVkXCI7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZURyaXZlcihfaWQsIGNvbmQpIHtcclxuICAgICAgICBjb25kID0gIWNvbmQgPyB7fSA6IGNvbmQ7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Vycm9yIScsIHN0YXR1czogZmFsc2UgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgRHJpdmVyTW9kZWwudXBkYXRlT25lKHsgX2lkLCAuLi5jb25kIH0sIHsgaXNEZWxldGVkOiB0cnVlIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiRGVsZXRlZCBzdWNjZXNzZnVsbHlcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBub3QgZGVsZXRlLiBTb21ldGhpbmcgd2VudCB3cm9uZy5cIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZGVsZXRlRHJpdmVyUGVybWFuZW50KGNvbmQpIHtcclxuICAgICAgICBhd2FpdCBEcml2ZXJNb2RlbC5kZWxldGVPbmUoeyAuLi5jb25kIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBmaW5kT3JDcmVhdGVXYWxsZXQoZHJpdmVySWQpIHtcclxuICAgICAgICBpZiAoIWRyaXZlcklkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRyaXZlciBkb2VzIG5vdCBleGlzdFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IHdhbGxldCA9IGF3YWl0IFdhbGxldE1vZGVsLmZpbmRPbmUoeyBkcml2ZXI6IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGRyaXZlcklkKSB9KTtcclxuICAgICAgICAgICAgaWYgKCF3YWxsZXQpIHtcclxuICAgICAgICAgICAgICAgIHdhbGxldCA9IG5ldyBXYWxsZXRNb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgd2FsbGV0LmFtb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICB3YWxsZXQuZHJpdmVyID0gZHJpdmVySWQ7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB3YWxsZXQuc2F2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB3YWxsZXQ7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciEgRWl0aGVyIHdhbGxldCBkb2VzIG5vdCBleGlzdCBvciBjYW4gbm90IGJlIGNyZWF0ZWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgd2FsbGV0RGF0YUxvZ2ljQWRtaW4oZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IHtcclxuICAgICAgICAgICAgLi4uZGF0YSxcclxuICAgICAgICAgICAgdHJhbnNhY3Rpb25JZDogJycsXHJcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uVHlwZTogZGF0YS50cmFuc2FjdGlvblR5cGUsXHJcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uTWV0aG9kOiAnYnlBZG1pbicsXHJcbiAgICAgICAgICAgIGFtb3VudDogZGF0YS5hbW91bnQsXHJcbiAgICAgICAgICAgIHN0YXR1czogJ3BlbmRpbmcnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRlbXBEYXRhID0gYXdhaXQgV2FsbGV0SGlzdG9yeU1vZGVsLmZpbmRPbmUoKS5zb3J0KHsgdHJhbnNhY3Rpb25JZDogLTEgfSk7XHJcbiAgICAgICAgaWYgKHRlbXBEYXRhPy50cmFuc2FjdGlvbklkKSB7XHJcbiAgICAgICAgICAgIGxldCB0cmFuc2FjdGlvbklkID0gdGVtcERhdGEudHJhbnNhY3Rpb25JZDtcclxuICAgICAgICAgICAgdHJhbnNhY3Rpb25JZCArPSAxO1xyXG4gICAgICAgICAgICByZXMudHJhbnNhY3Rpb25JZCA9IHBhcnNlSW50KHRlbXBEYXRhLnRyYW5zYWN0aW9uSWQpICsgMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXMudHJhbnNhY3Rpb25JZCA9IHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDAwMDAwMDAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgbGlzdFdhbGxldEhpc3RvcnkocXVlcnksIHBhcmFtcykge1xyXG4gICAgICAgIGNvbnN0IGlzQWxsID0gcGFyYW1zLmlzQWxsID09PSAnQUxMJztcclxuICAgICAgICBjb25zdCBkcml2ZXJJZCA9IHF1ZXJ5LmRyaXZlcklkO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdEYXRhIG5vdCBmb3VuZCEnLFxyXG4gICAgICAgICAgICByZXN1bHQ6IHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgICAgICAgcGFnZTogcXVlcnkucGFnZSAqIDEgPiAwID8gcXVlcnkucGFnZSAqIDEgOiAxLFxyXG4gICAgICAgICAgICAgICAgbGltaXQ6IHF1ZXJ5LmxpbWl0ICogMSA+IDAgPyBxdWVyeS5saW1pdCAqIDEgOiAyMCxcclxuICAgICAgICAgICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdGF0dXM6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgd2FsbGV0ID0gYXdhaXQgdGhpcy5maW5kT3JDcmVhdGVXYWxsZXQoZHJpdmVySWQpO1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2ggPSB7XHJcbiAgICAgICAgICAgICAgICB3YWxsZXQ6IHdhbGxldC5faWQsXHJcbiAgICAgICAgICAgICAgICBfaWQ6IHF1ZXJ5Ll9pZCxcclxuICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uSWQ6IHF1ZXJ5Py5rZXkgPyBwYXJzZUludChxdWVyeT8ua2V5KSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25UeXBlOiBxdWVyeS50cmFuc2FjdGlvblR5cGUgfHwgJycsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbk1ldGhvZDogcXVlcnkudHJhbnNhY3Rpb25NZXRob2QgfHwgJycsXHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6IHF1ZXJ5LnN0YXR1cyB8fCAnJyxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFyU2VhcmNoKHNlYXJjaCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkYWdncmVnYXRlID0gW1xyXG4gICAgICAgICAgICAgICAgeyAkbWF0Y2g6IHNlYXJjaCB9LFxyXG4gICAgICAgICAgICAgICAgeyAkc29ydDogeyBfaWQ6IC0xIH0gfSxcclxuICAgICAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAkbG9va3VwOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGZyb206ICdkcml2ZXJzJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgbG9jYWxGaWVsZDogJ2RyaXZlcicsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGZvcmVpZ25GaWVsZDogJ19pZCcsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGFzOiAnZHJpdmVyRGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHBpcGVsaW5lOiBbXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgJHByb2plY3Q6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgbmFtZTogMVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCIkcHJvamVjdFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uSWQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uVHlwZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25NZXRob2Q6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFtb3VudDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNBbW91bnQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRBbW91bnQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZlckRldGFpbHM6IDFcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8geyAkdW53aW5kOiBcIiRkcml2ZXJEZXRhaWxzXCIgfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY291bnRlciA9IGF3YWl0IFdhbGxldEhpc3RvcnlNb2RlbC5hZ2dyZWdhdGUoWy4uLiRhZ2dyZWdhdGUsIHsgJGNvdW50OiBcInRvdGFsXCIgfV0pO1xyXG4gICAgICAgICAgICByZXNwb25zZS5yZXN1bHQudG90YWwgPSBjb3VudGVyWzBdPy50b3RhbDtcclxuICAgICAgICAgICAgaWYgKGlzQWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5yZXN1bHQucGFnZSA9IDE7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5yZXN1bHQubGltaXQgPSByZXNwb25zZS5yZXN1bHQudG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5kYXRhID0gYXdhaXQgV2FsbGV0SGlzdG9yeU1vZGVsLmFnZ3JlZ2F0ZShcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAuLi4kYWdncmVnYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHsgJGxpbWl0OiByZXNwb25zZS5yZXN1bHQubGltaXQgKyByZXNwb25zZS5yZXN1bHQubGltaXQgKiAocmVzcG9uc2UucmVzdWx0LnBhZ2UgLSAxKSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgJHNraXA6IHJlc3BvbnNlLnJlc3VsdC5saW1pdCAqIChyZXNwb25zZS5yZXN1bHQucGFnZSAtIDEpIH1cclxuICAgICAgICAgICAgICAgIF0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnJlc3VsdC5kYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiRGF0YSBmZXRjaGVkXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgc2F2ZVdhbGxldEhpc3RvcnkoZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdFcnJvciEnLCBzdGF0dXM6IGZhbHNlIH07XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgd2FsbGV0ID0gYXdhaXQgdGhpcy5maW5kT3JDcmVhdGVXYWxsZXQoZGF0YS5kcml2ZXJJZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRwbERhdGEgPSBuZXcgV2FsbGV0SGlzdG9yeU1vZGVsKCk7XHJcblxyXG4gICAgICAgICAgICB0cGxEYXRhLndhbGxldCA9IHdhbGxldC5faWQ7XHJcbiAgICAgICAgICAgIHRwbERhdGEudHJhbnNhY3Rpb25JZCA9IGRhdGEudHJhbnNhY3Rpb25JZDtcclxuICAgICAgICAgICAgdHBsRGF0YS50cmFuc2FjdGlvblR5cGUgPSBkYXRhLnRyYW5zYWN0aW9uVHlwZTtcclxuICAgICAgICAgICAgdHBsRGF0YS50cmFuc2FjdGlvbk1ldGhvZCA9IGRhdGEudHJhbnNhY3Rpb25NZXRob2Q7XHJcbiAgICAgICAgICAgIHRwbERhdGEuYW1vdW50ID0gZGF0YS5hbW91bnQ7XHJcbiAgICAgICAgICAgIHRwbERhdGEucHJldmlvdXNBbW91bnQgPSBkYXRhLnByZXZpb3VzQW1vdW50O1xyXG4gICAgICAgICAgICB0cGxEYXRhLmN1cnJlbnRBbW91bnQgPSBkYXRhLmN1cnJlbnRBbW91bnQ7XHJcbiAgICAgICAgICAgIHRwbERhdGEuc3RhdHVzID0gZGF0YS5zdGF0dXM7XHJcbiAgICAgICAgICAgIHRwbERhdGEuZGVzY3JpcHRpb24gPSBkYXRhLmRlc2NyaXB0aW9uO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgdHBsRGF0YS5zYXZlKCk7XHJcblxyXG4gICAgICAgICAgICB0cGxEYXRhLnN0YXR1cyA9ICdjb21wbGV0ZWQnO1xyXG4gICAgICAgICAgICBhd2FpdCB0cGxEYXRhLnNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBDb21tb25TZXJ2aWNlLnVwZGF0ZVdhbGxldCh0cGxEYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdHBsRGF0YS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIldhbGxldCBpcyB1cGRhdGVkXCI7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19