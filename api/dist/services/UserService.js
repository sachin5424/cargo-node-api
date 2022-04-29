"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dataBase = require("../data-base");

var _helper = require("../utls/_helper");

var _config = _interopRequireDefault(require("../utls/config"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _adminModules = _interopRequireDefault(require("../data-base/models/adminModules"));

var _modue = _interopRequireDefault(require("../data-base/models/modue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Service {
  static async userLogin(data) {
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };
    const email = data.email;
    const password = data.password;

    try {
      const user = await _dataBase.UserModel.findOne({
        email: email,
        isDeleted: false
      });
      let isPasswordMatched = await _bcryptjs.default.compare(password, user.password);

      if (!isPasswordMatched) {
        throw new Error("Invalid Credentials");
      } else {
        const JWT_EXP_DUR = _config.default.jwt.expDuration;

        const accessToken = _jsonwebtoken.default.sign({
          sub: user._id.toString(),
          exp: Math.floor(Date.now() / 1000) + JWT_EXP_DUR * 60
        }, _config.default.jwt.secretKey);

        if (!user.emailVerified) {
          response.statusCode = 401;
          response.message = "Email is not verified. Please verify from the link sent to your email!!";
        } else if (!user.isActive) {
          response.statusCode = 401;
          response.message = "Your acount is blocked. Please contact admin";
        } else {
          response.statusCode = 200;
          response.status = true;
          response.message = "Loggedin successfully";
          let modules = [];

          if (user.type !== 'superAdmin') {
            modules = await _adminModules.default.findOne({
              typeKey: user.type
            }).select({
              grantedModules: 1
            });
            modules = modules.grantedModules;
          } else {
            modules = await _modue.default.find();
            modules = modules.map(v => v.key);
          }

          response.data = {
            accessToken,
            modules,
            userType: user.type
          };
        }
      }
    } catch (e) {
      throw new Error(e.message);
    }

    return response;
  }

  static async listUser(query, params) {
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
        type: {
          $ne: 'superAdmin'
        },
        $or: [{
          firstName: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }, {
          lastName: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }]
      }, (0, _helper.getAdminFilter)());

      if (global.cuser.type === 'stateAdmin') {
        search.type = {
          $in: ['districtAdmin', 'talukAdmin']
        };
      } else if (global.cuser.type === 'districtAdmin') {
        search.type = {
          $in: ['talukAdmin']
        };
      }

      (0, _helper.clearSearch)(search); // const driverFilter ={isDeleted: false, ...getAdminFilter()};
      // clearSearch(driverFilter);

      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, {
        "$project": {
          firstName: 1,
          lastName: 1,
          phoneNo: 1,
          email: 1,
          emailVerified: 1,
          dob: 1,
          type: 1,
          address: 1,
          state: 1,
          district: 1,
          taluk: 1,
          zipcode: 1,
          adharNo: 1,
          panNo: 1,
          isActive: 1,
          image: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'user/photo/', "$photo"]
            },
            name: "$photo"
          },
          adharCardImage: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'user/document/', "$adharCardPhoto"]
            },
            name: "$photo"
          },
          panCardImage: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'user/document/', "$panCardPhoto"]
            },
            name: "$photo"
          }
        }
      }];
      const counter = await _dataBase.UserModel.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _dataBase.UserModel.aggregate([...$aggregate, {
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

  static async saveUser(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _dataBase.UserModel.findById(_id) : new _dataBase.UserModel();
      tplData.type = data.type;
      tplData.firstName = data.firstName;
      tplData.lastName = data.lastName;
      tplData.phoneNo = data.phoneNo;
      tplData.email = data.email;
      tplData.emailVerified = true;
      !data.password || (tplData.password = data.password);
      tplData.dob = data.dob;
      tplData.photo = await (0, _helper.uploadFile)(data.photo, _config.default.uploadPaths.user.photo, _dataBase.UserModel, 'photo', _id);
      tplData.adharNo = data.adharNo;
      tplData.adharCardPhoto = await (0, _helper.uploadFile)(data.adharCardPhoto, _config.default.uploadPaths.user.document, _dataBase.UserModel, 'adharCardPhoto', _id);
      tplData.panNo = data.panNo;
      tplData.panCardPhoto = await (0, _helper.uploadFile)(data.panCardPhoto, _config.default.uploadPaths.user.document, _dataBase.UserModel, 'panCardPhoto', _id);
      tplData.address = data.address;
      tplData.state = data.state;
      tplData.district = data.district;
      tplData.taluk = data.taluk;
      tplData.zipcode = data.zipcode;
      tplData.isActive = data.isActive;
      await tplData.save();
      response.message = _id ? "Admin is Updated" : "A new admin is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteUser(_id, cond) {
    (0, _helper.clearSearch)({
      cond
    });
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _dataBase.UserModel.updateOne(_objectSpread({
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

}

exports.default = Service;