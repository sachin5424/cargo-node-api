"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _modue = _interopRequireDefault(require("../data-base/models/modue"));

var _adminModules = _interopRequireDefault(require("../data-base/models/adminModules"));

var _dataBase = require("../data-base");

var _helper = require("../utls/_helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AdminService {
  static async listModules(query, params) {
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
      const search = {
        _id: query._id,
        $or: [{
          title: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }, {
          key: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }]
      };
      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, {
        $project: {
          title: 1,
          key: 1
        }
      }];
      const counter = await _modue.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _modue.default.aggregate([...$aggregate, {
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

  static async saveModule(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _modue.default.findById(_id) : new _modue.default();
      tplData.title = data.title;
      tplData.key = data.key;
      await tplData.save();
      response.message = _id ? "Module is Updated" : "A new module is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteModule(_id) {
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _modue.default.findById(_id).remove();
      response.message = "Deleted successfully1111";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error("Can not delete. Something went wrong.");
    }
  }

  static async adminModules(query) {
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
      const search = {
        typeName: {
          $regex: '.*' + query?.key + '.*'
        },
        typeKey: {
          $ne: 'superAdmin'
        }
      };
      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $lookup: {
          from: "modules",
          localField: "grantedModules",
          foreignField: "key",
          as: "grantedModuleTitles",
          pipeline: [{
            $project: {
              title: 1,
              _id: 0
            }
          }]
        }
      }, {
        $project: {
          grantedModules: 1,
          grantedModuleTitles: 1,
          typeName: 1,
          typeKey: 1
        }
      }];
      response.result.data = await _adminModules.default.aggregate([...$aggregate, {
        $limit: response.result.limit + response.result.limit * (response.result.page - 1)
      }, {
        $skip: response.result.limit * (response.result.page - 1)
      }]).then(async function (data) {
        await _adminModules.default.aggregate([...$aggregate, {
          $count: "total"
        }]).then(count => {
          response.result.total = count[0].total;
        }).catch(err => {
          response.result.total = 0;
        });
        return data;
      }).catch(err => {
        throw new Error(err.message);
      });

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

  static async saveAdminModules(data) {
    const typeKey = data.typeKey;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = await _adminModules.default.findOne({
        typeKey
      });
      tplData.grantedModules = data.grantedModules;
      await tplData.save();
      response.message = "User permission is updated";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async listAdmin(query, params) {
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
        $or: [{
          firstName: {
            $regex: '.*' + query?.key + '.*'
          }
        }, {
          lastName: {
            $regex: '.*' + query?.key + '.*'
          }
        }]
      }, getAdminFilter());

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
          isActive: 1,
          image: {
            url: {
              $concat: [config.applicationFileUrl + 'customer/photo/', "$photo"]
            },
            name: "$photo"
          }
        }
      }];
      response.result.data = await _dataBase.UserModel.aggregate([...$aggregate, {
        $limit: response.result.limit + response.result.limit * (response.result.page - 1)
      }, {
        $skip: response.result.limit * (response.result.page - 1)
      }]).then(async function (data) {
        await _dataBase.UserModel.aggregate([...$aggregate, {
          $count: "total"
        }]).then(count => {
          response.result.total = count[0].total;
        }).catch(err => {
          response.result.total = 0;
        });
        return data;
      }).catch(err => {
        throw new Error(err.message);
      });

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

  static async saveAdmin(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _dataBase.UserModel.findById(_id) : new _dataBase.UserModel();
      tplData.firstName = data.firstName;
      tplData.lastName = data.lastName;
      tplData.phoneNo = data.phoneNo;
      tplData.email = data.email;
      !data.password || (tplData.password = data.password);
      tplData.dob = data.dob; // tplData.photo = await uploadFile(data.photo, config.uploadPaths.customer.photo, UserModel, 'photo', _id);

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
      throw new Error(e);
    }
  }

  static async deleteAdmin(_id, cond) {
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

exports.default = AdminService;