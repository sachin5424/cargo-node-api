"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _helper = require("../utls/_helper");

var _state = _interopRequireDefault(require("../data-base/models/state"));

var _district = _interopRequireDefault(require("../data-base/models/district"));

var _taluk = _interopRequireDefault(require("../data-base/models/taluk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Service {
  static async sdtList(query) {
    const response = {
      statusCode: 400,
      message: 'Data not found!',
      result: {
        data: []
      },
      status: false
    };

    try {
      const searchState = global.state ? {
        _id: global.state,
        isActive: true,
        isDeleted: false
      } : {
        isActive: true,
        isDeleted: false
      };
      const searchDistrict = global.district ? {
        _id: global.district,
        isActive: true,
        isDeleted: false
      } : {
        isActive: true,
        isDeleted: false
      };
      const searchTaluk = global.taluk ? {
        _id: global.taluk,
        isActive: true,
        isDeleted: false
      } : {
        isActive: true,
        isDeleted: false
      };
      (0, _helper.clearSearch)(searchState);
      (0, _helper.clearSearch)(searchDistrict);
      (0, _helper.clearSearch)(searchTaluk);
      const aggregate = [{
        $match: searchState
      }, {
        $lookup: {
          from: 'districts',
          localField: '_id',
          foreignField: 'state',
          as: 'districts',
          pipeline: [{
            $match: searchDistrict
          }, {
            $lookup: {
              from: 'taluks',
              localField: '_id',
              foreignField: 'district',
              as: 'taluks',
              pipeline: [{
                $match: searchTaluk
              }, {
                $project: {
                  "name": 1
                }
              }]
            }
          }, {
            $project: {
              "name": 1,
              "taluks": 1
            }
          }]
        }
      }, {
        $project: {
          "name": 1,
          "districts": 1
        }
      }];
      response.result.data = await _state.default.aggregate(aggregate);

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

  static async listState(query, params) {
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
        $or: [{
          name: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }]
      }, (0, _helper.getAdminFilter)('_id'));

      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, {
        "$project": {
          name: 1,
          isActive: 1
        }
      }];
      const counter = await _state.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _state.default.aggregate([...$aggregate, {
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

  static async saveState(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _state.default.findById(_id) : new _state.default();
      tplData.name = data.name;
      tplData.isActive = data.isActive;
      await tplData.save();
      response.message = _id ? "State is updated" : "A new state is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteState(_id, cond) {
    (0, _helper.clearSearch)({
      cond
    });
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _state.default.updateOne(_objectSpread({
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

  static async listDistrict(query, params) {
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
        $or: [{
          name: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }],
        state: query.state ? _mongoose.default.Types.ObjectId(query.state) : ''
      }, (0, _helper.getAdminFilter)('state', '_id'));

      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, // {
      //     $lookup: {
      //         from: 'states',
      //         localField: 'state',
      //         foreignField: '_id',
      //         as: 'stateDetails',
      //         pipeline: [
      //             {
      //                 $match: {isDeleted: false}
      //             }
      //         ]
      //     }
      // },
      // { $unwind: { path: "$stateDetails", preserveNullAndEmptyArrays: false} },
      {
        "$project": {
          name: 1,
          state: 1,
          isActive: 1
        }
      }];
      const counter = await _district.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _district.default.aggregate([...$aggregate, {
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

  static async saveDistrict(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _district.default.findById(_id) : new _district.default();
      tplData.name = data.name;
      tplData.isActive = data.isActive;
      tplData.state = data.state;
      await tplData.save();
      response.message = _id ? "District is updated" : "A new district is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteDistrict(_id, cond) {
    (0, _helper.clearSearch)({
      cond
    });
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _district.default.updateOne(_objectSpread({
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

  static async listTaluk(query, params) {
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
        $or: [{
          name: {
            $regex: '.*' + (query?.key || '') + '.*'
          }
        }],
        district: query.district ? _mongoose.default.Types.ObjectId(query.district) : ''
      }, (0, _helper.getAdminFilter)('state', 'district', '_id'));

      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, {
        "$project": {
          name: 1,
          state: 1,
          district: 1,
          isActive: 1
        }
      }];
      const counter = await _taluk.default.aggregate([...$aggregate, {
        $count: "total"
      }]);
      response.result.total = counter[0]?.total;

      if (isAll) {
        response.result.page = 1;
        response.result.limit = response.result.total;
      }

      response.result.data = await _taluk.default.aggregate([...$aggregate, {
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

  static async saveTaluk(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _taluk.default.findById(_id) : new _taluk.default();
      tplData.name = data.name;
      tplData.state = data.state;
      tplData.district = data.district;
      tplData.isActive = data.isActive;
      await tplData.save();
      response.message = _id ? "Taluk is updated" : "A new Taluk is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteTaluk(_id, cond) {
    (0, _helper.clearSearch)({
      cond
    });
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _taluk.default.updateOne(_objectSpread({
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