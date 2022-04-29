"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _notification = _interopRequireDefault(require("../data-base/models/notification"));

var _helper = require("../utls/_helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Service {
  static async listNotifications(query, params) {
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
        $or: [{
          content: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }]
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
          from: 'states',
          localField: 'state',
          foreignField: '_id',
          as: 'stateDetails',
          pipeline: [{
            $project: {
              name: 1
            }
          }]
        }
      }, {
        $unwind: {
          path: "$stateDetails",
          preserveNullAndEmptyArrays: true
        }
      }, {
        $lookup: {
          from: 'districts',
          localField: 'district',
          foreignField: '_id',
          as: 'districtDetails',
          pipeline: [{
            $project: {
              name: 1
            }
          }]
        }
      }, {
        $unwind: {
          path: "$districtDetails",
          preserveNullAndEmptyArrays: true
        }
      }, {
        $lookup: {
          from: 'taluks',
          localField: 'taluk',
          foreignField: '_id',
          as: 'talukDetails',
          pipeline: [{
            $project: {
              name: 1
            }
          }]
        }
      }, {
        $unwind: {
          path: "$talukDetails",
          preserveNullAndEmptyArrays: true
        }
      }, {
        "$project": {
          state: 1,
          district: 1,
          taluk: 1,
          serviceType: 1,
          to: 1,
          userIds: 1,
          content: 1,
          stateDetails: 1,
          districtDetails: 1,
          talukDetails: 1
        }
      }];
      const counter = await _notification.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _notification.default.aggregate([...$aggregate, {
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

  static async saveNotification(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _notification.default.findById(_id) : new _notification.default();
      tplData.state = data.state;
      tplData.district = data.district;
      tplData.taluk = data.taluk;
      tplData.serviceType = data.serviceType;
      tplData.to = data.to;
      tplData.content = data.content;
      tplData.userIds = data.userIds;
      await tplData.save();
      response.message = _id ? "Notificaion is Updated" : "A new notification is sent";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteNotificationPermanent(_id, cond) {
    cond = !cond ? {} : cond;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _notification.default.deleteOne(_objectSpread({
        _id
      }, cond));
      response.message = "Deleted successfully";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error("Can not delete. Something went wrong.");
    }
  } // static async getCustomerIds(data) {
  //     const search = {
  //         isDeleted: false,
  //         state: data.state ? mongoose.Types.ObjectId(data.state) : '',
  //         district: data.district ? mongoose.Types.ObjectId(data.district) : '',
  //         taluk: data.taluk ? mongoose.Types.ObjectId(data.taluk) : '',
  //     };
  //     clearSearch(search);
  //     const userDatas = await CustomerModel.find(search);
  //     data.userIds = userDatas.map(v => v._id);
  //     return data.userIds;
  // }
  // static async getDriverIds(data) {
  //     const search = {
  //         isDeleted: false,
  //         state: data.state ? mongoose.Types.ObjectId(data.state) : '',
  //         district: data.district ? mongoose.Types.ObjectId(data.district) : '',
  //         taluk: data.taluk ? mongoose.Types.ObjectId(data.taluk) : '',
  //         serviceType: data.serviceType ? mongoose.Types.ObjectId(data.serviceType) : '',
  //     };
  //     clearSearch(search);
  //     const userDatas = await DriverModel.find(search);
  //     data.userIds = userDatas.map(v => v._id);
  //     return data.userIds;
  // }
  // static async getAdminIds(data) {
  //     const search = {
  //         isDeleted: false,
  //         state: data.state ? mongoose.Types.ObjectId(data.state) : '',
  //         district: data.district ? mongoose.Types.ObjectId(data.district) : '',
  //         taluk: data.taluk ? mongoose.Types.ObjectId(data.taluk) : '',
  //     };
  //     clearSearch(search);
  //     const userDatas = await UserModel.find(search);
  //     data.userIds = userDatas.map(v => v._id);
  //     return data.userIds;
  // }


}

exports.default = Service;