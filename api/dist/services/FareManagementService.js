"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _fareManagement = _interopRequireDefault(require("../data-base/models/fareManagement"));

var _serviceType = _interopRequireDefault(require("../data-base/models/serviceType"));

var _helper = require("../utls/_helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Service {
  static async listFareManagemengt(query, params) {
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
      const serviceType = await _serviceType.default.findOne({
        key: query?.serviceTypeKey
      });

      const search = _objectSpread({
        _id: query._id,
        isDeleted: false,
        serviceType: serviceType?._id,
        rideType: query.rideType ? _mongoose.default.Types.ObjectId(query.rideType) : ''
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
          from: 'servicetypes',
          localField: 'serviceType',
          foreignField: '_id',
          as: 'serviceTypeDetails',
          pipeline: [{
            $project: {
              name: 1
            }
          }]
        }
      }, {
        $unwind: "$serviceTypeDetails"
      }, {
        $lookup: {
          from: 'ridetypes',
          localField: 'rideType',
          foreignField: '_id',
          as: 'rideTypeDetails',
          pipeline: [{
            $project: {
              name: 1
            }
          }]
        }
      }, {
        $unwind: "$rideTypeDetails"
      }, {
        $lookup: {
          from: 'vehiclecategories',
          localField: 'vehicleCategory',
          foreignField: '_id',
          as: 'vehicleCategoryDetails',
          pipeline: [{
            $project: {
              name: 1
            }
          }]
        }
      }, {
        $unwind: "$vehicleCategoryDetails"
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
        $unwind: "$stateDetails"
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
        $unwind: "$districtDetails"
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
        $unwind: "$talukDetails"
      }, {
        "$project": {
          serviceType: 1,
          rideType: 1,
          vehicleCategory: 1,
          state: 1,
          district: 1,
          taluk: 1,
          baseFare: 1,
          bookingFare: 1,
          perMinuteFare: 1,
          cancelCharge: 1,
          waitingCharge: 1,
          adminCommissionType: 1,
          adminCommissionValue: 1,
          perKMCharges: 1,
          serviceTypeDetails: 1,
          rideTypeDetails: 1,
          vehicleCategoryDetails: 1,
          stateDetails: 1,
          districtDetails: 1,
          talukDetails: 1
        }
      }];
      const counter = await _fareManagement.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _fareManagement.default.aggregate([...$aggregate, {
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

  static async saveFareManagemengt(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _fareManagement.default.findById(_id) : new _fareManagement.default();
      tplData.serviceType = data.serviceType;
      tplData.rideType = data.rideType;
      tplData.vehicleCategory = data.vehicleCategory;
      tplData.state = data.state;
      tplData.district = data.district;
      tplData.taluk = data.taluk;
      tplData.baseFare = data.baseFare;
      tplData.bookingFare = data.bookingFare;
      tplData.perMinuteFare = data.perMinuteFare;
      tplData.cancelCharge = data.cancelCharge;
      tplData.waitingCharge = data.waitingCharge;
      tplData.adminCommissionType = data.adminCommissionType;
      tplData.adminCommissionValue = data.adminCommissionValue;
      tplData.perKMCharges = data.perKMCharges;
      await tplData.save();
      response.message = _id ? "Fare management is Updated" : "A new fare management is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteFareManagemengt(_id, cond) {
    cond = !cond ? {} : cond;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _fareManagement.default.updateOne(_objectSpread({
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

  static async deleteFareManagemengtPermanent(_id, cond) {
    cond = !cond ? {} : cond;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _fareManagement.default.deleteOne(_objectSpread({
        _id
      }, cond));
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