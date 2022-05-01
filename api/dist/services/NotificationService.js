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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Ob3RpZmljYXRpb25TZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIlNlcnZpY2UiLCJsaXN0Tm90aWZpY2F0aW9ucyIsInF1ZXJ5IiwicGFyYW1zIiwiaXNBbGwiLCJyZXNwb25zZSIsInN0YXR1c0NvZGUiLCJtZXNzYWdlIiwicmVzdWx0IiwiZGF0YSIsInBhZ2UiLCJsaW1pdCIsInRvdGFsIiwic3RhdHVzIiwic2VhcmNoIiwiX2lkIiwiJG9yIiwiY29udGVudCIsIiRyZWdleCIsImtleSIsIiRhZ2dyZWdhdGUiLCIkbWF0Y2giLCIkc29ydCIsIiRsb29rdXAiLCJmcm9tIiwibG9jYWxGaWVsZCIsImZvcmVpZ25GaWVsZCIsImFzIiwicGlwZWxpbmUiLCIkcHJvamVjdCIsIm5hbWUiLCIkdW53aW5kIiwicGF0aCIsInByZXNlcnZlTnVsbEFuZEVtcHR5QXJyYXlzIiwic3RhdGUiLCJkaXN0cmljdCIsInRhbHVrIiwic2VydmljZVR5cGUiLCJ0byIsInVzZXJJZHMiLCJzdGF0ZURldGFpbHMiLCJkaXN0cmljdERldGFpbHMiLCJ0YWx1a0RldGFpbHMiLCJjb3VudGVyIiwiTm90aWZpY2F0aW9uTW9kZWwiLCJhZ2dyZWdhdGUiLCIkY291bnQiLCIkbGltaXQiLCIkc2tpcCIsImxlbmd0aCIsImUiLCJFcnJvciIsInNhdmVOb3RpZmljYXRpb24iLCJ0cGxEYXRhIiwiZmluZEJ5SWQiLCJzYXZlIiwiZGVsZXRlTm90aWZpY2F0aW9uUGVybWFuZW50IiwiY29uZCIsImRlbGV0ZU9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOztBQUNBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEsT0FBTixDQUFjO0FBRUssZUFBakJDLGlCQUFpQixDQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBZ0I7QUFDMUMsVUFBTUMsS0FBSyxHQUFHRCxNQUFNLENBQUNDLEtBQVAsS0FBaUIsS0FBL0I7QUFDQSxVQUFNQyxRQUFRLEdBQUc7QUFDYkMsTUFB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QUFNK0Isc0JBQWtCYyxTQUFsQjtBQUE4QjNDLFFBQUFBO0FBQTlCLFNBQXNDMEMsSUFBdEMsRUFBTjtBQUVBcEQsTUFBQUEsUUFBUSxDQUFDRSxPQUFULEdBQW1CLHNCQUFuQjtBQUNBRixNQUFBQSxRQUFRLENBQUNDLFVBQVQsR0FBc0IsR0FBdEI7QUFDQUQsTUFBQUEsUUFBUSxDQUFDUSxNQUFULEdBQWtCLElBQWxCO0FBQ0EsYUFBT1IsUUFBUDtBQUVILEtBUkQsQ0FRRSxPQUFPNkMsQ0FBUCxFQUFVO0FBQ1IsWUFBTSxJQUFJQyxLQUFKLENBQVUsdUNBQVYsQ0FBTjtBQUNIO0FBQ0osR0EzS3dCLENBNkt6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTs7O0FBdE55QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuLy8gaW1wb3J0IExvZ2dlciBmcm9tICcuLi91dGxzL0xvZ2dlcic7XHJcbmltcG9ydCBOb3RpZmljYXRpb25Nb2RlbCBmcm9tICcuLi9kYXRhLWJhc2UvbW9kZWxzL25vdGlmaWNhdGlvbic7XHJcbmltcG9ydCB7IGNsZWFyU2VhcmNoLCBnZXRBZG1pbkZpbHRlciB9IGZyb20gJy4uL3V0bHMvX2hlbHBlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlIHtcclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgbGlzdE5vdGlmaWNhdGlvbnMocXVlcnksIHBhcmFtcykge1xyXG4gICAgICAgIGNvbnN0IGlzQWxsID0gcGFyYW1zLmlzQWxsID09PSAnQUxMJztcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHtcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNDAwLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnRGF0YSBub3QgZm91bmQhJyxcclxuICAgICAgICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgICAgIHBhZ2U6IHF1ZXJ5LnBhZ2UgKiAxID4gMCA/IHF1ZXJ5LnBhZ2UgKiAxIDogMSxcclxuICAgICAgICAgICAgICAgIGxpbWl0OiBxdWVyeS5saW1pdCAqIDEgPiAwID8gcXVlcnkubGltaXQgKiAxIDogMjAsXHJcbiAgICAgICAgICAgICAgICB0b3RhbDogMCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RhdHVzOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCA9IHtcclxuICAgICAgICAgICAgICAgIF9pZDogcXVlcnkuX2lkLFxyXG4gICAgICAgICAgICAgICAgJG9yOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiB7ICRyZWdleDogJy4qJyArIChxdWVyeT8ua2V5IHx8ICcnKSArICcuKicgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgLi4uZ2V0QWRtaW5GaWx0ZXIoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY2xlYXJTZWFyY2goc2VhcmNoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0ICRhZ2dyZWdhdGUgPSBbXHJcbiAgICAgICAgICAgICAgICB7ICRtYXRjaDogc2VhcmNoIH0sXHJcbiAgICAgICAgICAgICAgICB7ICRzb3J0OiB7IF9pZDogLTEgfSB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICRsb29rdXA6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogJ3N0YXRlcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsRmllbGQ6ICdzdGF0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVpZ25GaWVsZDogJ19pZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzOiAnc3RhdGVEZXRhaWxzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGlwZWxpbmU6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcHJvamVjdDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHsgJHVud2luZDoge3BhdGg6IFwiJHN0YXRlRGV0YWlsc1wiLCBwcmVzZXJ2ZU51bGxBbmRFbXB0eUFycmF5czogdHJ1ZX0gfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9va3VwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICdkaXN0cmljdHMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbEZpZWxkOiAnZGlzdHJpY3QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlaWduRmllbGQ6ICdfaWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhczogJ2Rpc3RyaWN0RGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVsaW5lOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2plY3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgeyAkdW53aW5kOiB7IHBhdGg6IFwiJGRpc3RyaWN0RGV0YWlsc1wiLCBwcmVzZXJ2ZU51bGxBbmRFbXB0eUFycmF5czogdHJ1ZX0gfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9va3VwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206ICd0YWx1a3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbEZpZWxkOiAndGFsdWsnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlaWduRmllbGQ6ICdfaWQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhczogJ3RhbHVrRGV0YWlscycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVsaW5lOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2plY3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7ICR1bndpbmQ6IHsgcGF0aDogXCIkdGFsdWtEZXRhaWxzXCIsIHByZXNlcnZlTnVsbEFuZEVtcHR5QXJyYXlzOiB0cnVlfSB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiJHByb2plY3RcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3Q6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhbHVrOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlVHlwZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZHM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlRGV0YWlsczogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzdHJpY3REZXRhaWxzOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWx1a0RldGFpbHM6IDEsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb3VudGVyID0gYXdhaXQgTm90aWZpY2F0aW9uTW9kZWwuYWdncmVnYXRlKFsuLi4kYWdncmVnYXRlLCB7ICRjb3VudDogXCJ0b3RhbFwiIH1dKTtcclxuICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnRvdGFsID0gY291bnRlclswXT8udG90YWw7XHJcbiAgICAgICAgICAgIGlmIChpc0FsbCkge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnBhZ2UgPSAxO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LmxpbWl0ID0gcmVzcG9uc2UucmVzdWx0LnRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC50b3RhbCA9IGNvdW50ZXJbMF0/LnRvdGFsO1xyXG4gICAgICAgICAgICBpZiAoaXNBbGwpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5wYWdlID0gMTtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5saW1pdCA9IHJlc3BvbnNlLnJlc3VsdC50b3RhbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LmRhdGEgPSBhd2FpdCBOb3RpZmljYXRpb25Nb2RlbC5hZ2dyZWdhdGUoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uJGFnZ3JlZ2F0ZSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRsaW1pdDogcmVzcG9uc2UucmVzdWx0LmxpbWl0ICsgcmVzcG9uc2UucmVzdWx0LmxpbWl0ICogKHJlc3BvbnNlLnJlc3VsdC5wYWdlIC0gMSkgfSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRza2lwOiByZXNwb25zZS5yZXN1bHQubGltaXQgKiAocmVzcG9uc2UucmVzdWx0LnBhZ2UgLSAxKSB9XHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXN1bHQuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkRhdGEgZmV0Y2hlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlTm90aWZpY2F0aW9uKGRhdGEpIHtcclxuICAgICAgICBjb25zdCBfaWQgPSBkYXRhLl9pZDtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0cGxEYXRhID0gX2lkID8gYXdhaXQgTm90aWZpY2F0aW9uTW9kZWwuZmluZEJ5SWQoX2lkKSA6IG5ldyBOb3RpZmljYXRpb25Nb2RlbCgpO1xyXG5cclxuICAgICAgICAgICAgdHBsRGF0YS5zdGF0ZSA9IGRhdGEuc3RhdGU7XHJcbiAgICAgICAgICAgIHRwbERhdGEuZGlzdHJpY3QgPSBkYXRhLmRpc3RyaWN0O1xyXG4gICAgICAgICAgICB0cGxEYXRhLnRhbHVrID0gZGF0YS50YWx1aztcclxuICAgICAgICAgICAgdHBsRGF0YS5zZXJ2aWNlVHlwZSA9IGRhdGEuc2VydmljZVR5cGU7XHJcbiAgICAgICAgICAgIHRwbERhdGEudG8gPSBkYXRhLnRvO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmNvbnRlbnQgPSBkYXRhLmNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICB0cGxEYXRhLnVzZXJJZHMgPSBkYXRhLnVzZXJJZHM7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0cGxEYXRhLnNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBfaWQgPyBcIk5vdGlmaWNhaW9uIGlzIFVwZGF0ZWRcIiA6IFwiQSBuZXcgbm90aWZpY2F0aW9uIGlzIHNlbnRcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZU5vdGlmaWNhdGlvblBlcm1hbmVudChfaWQsIGNvbmQpIHtcclxuICAgICAgICBjb25kID0gIWNvbmQgPyB7fSA6IGNvbmQ7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7IHN0YXR1c0NvZGU6IDQwMCwgbWVzc2FnZTogJ0Vycm9yIScsIHN0YXR1czogZmFsc2UgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgTm90aWZpY2F0aW9uTW9kZWwuZGVsZXRlT25lKHsgX2lkLCAuLi5jb25kIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiRGVsZXRlZCBzdWNjZXNzZnVsbHlcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBub3QgZGVsZXRlLiBTb21ldGhpbmcgd2VudCB3cm9uZy5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHN0YXRpYyBhc3luYyBnZXRDdXN0b21lcklkcyhkYXRhKSB7XHJcbiAgICAvLyAgICAgY29uc3Qgc2VhcmNoID0ge1xyXG4gICAgLy8gICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxyXG4gICAgLy8gICAgICAgICBzdGF0ZTogZGF0YS5zdGF0ZSA/IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGRhdGEuc3RhdGUpIDogJycsXHJcbiAgICAvLyAgICAgICAgIGRpc3RyaWN0OiBkYXRhLmRpc3RyaWN0ID8gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoZGF0YS5kaXN0cmljdCkgOiAnJyxcclxuICAgIC8vICAgICAgICAgdGFsdWs6IGRhdGEudGFsdWsgPyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChkYXRhLnRhbHVrKSA6ICcnLFxyXG4gICAgLy8gICAgIH07XHJcblxyXG4gICAgLy8gICAgIGNsZWFyU2VhcmNoKHNlYXJjaCk7XHJcbiAgICAvLyAgICAgY29uc3QgdXNlckRhdGFzID0gYXdhaXQgQ3VzdG9tZXJNb2RlbC5maW5kKHNlYXJjaCk7XHJcbiAgICAvLyAgICAgZGF0YS51c2VySWRzID0gdXNlckRhdGFzLm1hcCh2ID0+IHYuX2lkKTtcclxuICAgIC8vICAgICByZXR1cm4gZGF0YS51c2VySWRzO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gc3RhdGljIGFzeW5jIGdldERyaXZlcklkcyhkYXRhKSB7XHJcbiAgICAvLyAgICAgY29uc3Qgc2VhcmNoID0ge1xyXG4gICAgLy8gICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxyXG4gICAgLy8gICAgICAgICBzdGF0ZTogZGF0YS5zdGF0ZSA/IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGRhdGEuc3RhdGUpIDogJycsXHJcbiAgICAvLyAgICAgICAgIGRpc3RyaWN0OiBkYXRhLmRpc3RyaWN0ID8gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoZGF0YS5kaXN0cmljdCkgOiAnJyxcclxuICAgIC8vICAgICAgICAgdGFsdWs6IGRhdGEudGFsdWsgPyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChkYXRhLnRhbHVrKSA6ICcnLFxyXG4gICAgLy8gICAgICAgICBzZXJ2aWNlVHlwZTogZGF0YS5zZXJ2aWNlVHlwZSA/IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGRhdGEuc2VydmljZVR5cGUpIDogJycsXHJcbiAgICAvLyAgICAgfTtcclxuXHJcbiAgICAvLyAgICAgY2xlYXJTZWFyY2goc2VhcmNoKTtcclxuICAgIC8vICAgICBjb25zdCB1c2VyRGF0YXMgPSBhd2FpdCBEcml2ZXJNb2RlbC5maW5kKHNlYXJjaCk7XHJcbiAgICAvLyAgICAgZGF0YS51c2VySWRzID0gdXNlckRhdGFzLm1hcCh2ID0+IHYuX2lkKTtcclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIGRhdGEudXNlcklkcztcclxuICAgIC8vIH1cclxuICAgIC8vIHN0YXRpYyBhc3luYyBnZXRBZG1pbklkcyhkYXRhKSB7XHJcbiAgICAvLyAgICAgY29uc3Qgc2VhcmNoID0ge1xyXG4gICAgLy8gICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxyXG4gICAgLy8gICAgICAgICBzdGF0ZTogZGF0YS5zdGF0ZSA/IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGRhdGEuc3RhdGUpIDogJycsXHJcbiAgICAvLyAgICAgICAgIGRpc3RyaWN0OiBkYXRhLmRpc3RyaWN0ID8gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoZGF0YS5kaXN0cmljdCkgOiAnJyxcclxuICAgIC8vICAgICAgICAgdGFsdWs6IGRhdGEudGFsdWsgPyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChkYXRhLnRhbHVrKSA6ICcnLFxyXG4gICAgLy8gICAgIH07XHJcblxyXG4gICAgLy8gICAgIGNsZWFyU2VhcmNoKHNlYXJjaCk7XHJcbiAgICAvLyAgICAgY29uc3QgdXNlckRhdGFzID0gYXdhaXQgVXNlck1vZGVsLmZpbmQoc2VhcmNoKTtcclxuICAgIC8vICAgICBkYXRhLnVzZXJJZHMgPSB1c2VyRGF0YXMubWFwKHYgPT4gdi5faWQpO1xyXG5cclxuICAgIC8vICAgICByZXR1cm4gZGF0YS51c2VySWRzO1xyXG4gICAgLy8gfVxyXG5cclxufSJdfQ==