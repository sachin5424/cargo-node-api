"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _ejs = _interopRequireDefault(require("ejs"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _config = _interopRequireDefault(require("../utls/config"));

var _emailTemplate = _interopRequireDefault(require("../data-base/models/emailTemplate"));

var _emailSent = _interopRequireDefault(require("../data-base/models/emailSent"));

var _driver = _interopRequireDefault(require("../data-base/models/driver"));

var _customer = _interopRequireDefault(require("../data-base/models/customer"));

var _userModel = require("../data-base/models/userModel");

var _helper = require("../utls/_helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const transporter = _nodemailer.default.createTransport({
  service: 'gmail',
  auth: {
    user: _config.default.email.id,
    pass: _config.default.email.password
  }
});

class Service {
  /*
  static async sendEmail(to, subject, html) {
        const mailOptions = {
          from: Config.email.id,
          to: to,
          subject: subject,
          html: html
      };
  
      return new Promise((resolve, reject) => {
          return transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                  Logger.error(
                      `
                          Error while sending mail
                          To   			- ${to}
                          Subject   		- ${subject}
                          Reason   	    - ${error.message}
                      `
                  );
                  reject(error);
              } else {
                  Logger.info(
                      `
                          An email was sent
                          To   			- ${to}
                          Subject   		- ${subject}
                          Response 	    - ${info.response}
                          Message Id 	    - ${info.messageId}
                          Info            - ${info}
                      `
                  );
                  resolve(info);
              }
          });
      })
  }
  */
  static async listTemplates(query, params) {
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
          subject: {
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
        "$project": {
          subject: 1,
          key: 1,
          html: 1,
          deletable: 1
        }
      }];
      const counter = await _emailTemplate.default.aggregate([...$aggregate, {
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

      response.result.data = await _emailTemplate.default.aggregate([...$aggregate, {
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

  static async saveTemplate(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _emailTemplate.default.findById(_id) : new _emailTemplate.default();
      tplData.subject = data.subject;
      tplData.key = data.key;
      tplData.html = data.html;
      await tplData.save();
      response.message = _id ? "Email template is Updated" : "A new email template is created";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteTemplatePermanent(_id, cond) {
    cond = !cond ? {} : cond;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _emailTemplate.default.deleteOne(_objectSpread({
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

  static async sendEmail(data) {
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };
    let emailIds = [];

    try {
      if (data.emailTemplate !== 'custom') {
        const template = await _emailTemplate.default.findById(data.emailTemplate);
        data.subject = template.subject;
        data.html = template.html;
      }

      data.html = data.html.replace(/&lt;%=/g, "<%=");
      data.html = data.html.replace(/%&gt;/g, "%>");

      if (data.to === 'manyCustomers' || data.to === 'allCustomers') {
        emailIds = await this.sendMailToCustomers(data);
      }

      if (data.to === 'manyDrivers' || data.to === 'allDrivers') {
        emailIds = await this.sendMailToDrivers(data);
      }

      if (data.to === 'manyAdmins' || data.to === 'allAdmins') {
        emailIds = await this.sendMailToAdmins(data);
      }

      if (data.to === 'custom') {
        emailIds = await this.sendMailToEmailIds(data);
      }

      const tplData = new _emailSent.default();

      if (data.emailTemplate !== 'custom') {
        tplData.emailTemplate = data.emailTemplate;
      } else {
        tplData.emailContent.subject = data.subject;
        tplData.emailContent.html = data.html;
      }

      if (data.state) {
        tplData.state = data.state;
      }

      if (data.district) {
        tplData.district = data.district;
      }

      if (data.taluk) {
        tplData.taluk = data.taluk;
      }

      if (data.serviceType) {
        tplData.serviceType = data.serviceType;
      }

      tplData.to = data.to;
      tplData.emailIds = emailIds;
      await tplData.save();
      response.statusCode = 400;
      response.message = "Email sent";
      response.emailIds = emailIds;
      return response;
    } catch (e) {
      throw new Error("Error while sending email! Please check email template or composed mail");
    }
  }

  static async sendMailToCustomers(data) {
    if (data.to === 'allCustomers') {
      const search = {
        isDeleted: false,
        state: data.state ? _mongoose.default.Types.ObjectId(data.state) : '',
        district: data.district ? _mongoose.default.Types.ObjectId(data.district) : '',
        taluk: data.taluk ? _mongoose.default.Types.ObjectId(data.taluk) : ''
      };
      (0, _helper.clearSearch)(search);
      const userDatas = await _customer.default.find(search);
      data.emailIds = userDatas.map(v => v.email);
    }

    if (data.html.includes('<%=') && data.html.includes('%>')) {
      data.emailIds?.forEach(async v => {
        const userData = await _customer.default.findOne({
          email: v,
          isDeleted: false
        });
        const html = await _ejs.default.render(data.html, _objectSpread(_objectSpread({}, userData._doc), data?.emailData));
        await (0, _helper.mailer)(v, data.subject, html);
      });
    } else {
      await (0, _helper.mailer)(data.emailIds, data.subject, data.html);
    }

    return data.emailIds;
  }

  static async sendMailToDrivers(data) {
    if (data.to === 'allDrivers') {
      const search = {
        isDeleted: false,
        state: data.state ? _mongoose.default.Types.ObjectId(data.state) : '',
        district: data.district ? _mongoose.default.Types.ObjectId(data.district) : '',
        taluk: data.taluk ? _mongoose.default.Types.ObjectId(data.taluk) : '',
        serviceType: data.serviceType ? _mongoose.default.Types.ObjectId(data.serviceType) : ''
      };
      (0, _helper.clearSearch)(search);
      const userDatas = await _driver.default.find(search);
      data.emailIds = userDatas.map(v => v.email);
    }

    if (data.html.includes('<%= firstName %>') || data.html.includes('<%= lastName %>') || data.html.includes('<%= email %>')) {
      data.emailIds?.forEach(async v => {
        const userData = await _driver.default.findOne({
          email: v,
          isDeleted: false
        });
        const html = await _ejs.default.render(data.html, _objectSpread({}, userData._doc));
        await (0, _helper.mailer)(v, data.subject, html);
      });
    } else {
      await (0, _helper.mailer)(data.emailIds, data.subject, data.html);
    }

    return data.emailIds;
  }

  static async sendMailToAdmins(data) {
    if (data.to === 'allDrivers') {
      const search = {
        isDeleted: false,
        state: data.state ? _mongoose.default.Types.ObjectId(data.state) : '',
        district: data.district ? _mongoose.default.Types.ObjectId(data.district) : '',
        taluk: data.taluk ? _mongoose.default.Types.ObjectId(data.taluk) : ''
      };
      (0, _helper.clearSearch)(search);
      const userDatas = await _userModel.UserModel.find(search);
      data.emailIds = userDatas.map(v => v.email);
    }

    if (data.html.includes('<%= firstName %>') || data.html.includes('<%= lastName %>') || data.html.includes('<%= email %>')) {
      data.emailIds?.forEach(async v => {
        const userData = await _userModel.UserModel.findOne({
          email: v,
          isDeleted: false
        });
        const html = await _ejs.default.render(data.html, _objectSpread({}, userData._doc));
        await (0, _helper.mailer)(v, data.subject, html);
      });
    } else {
      await (0, _helper.mailer)(data.emailIds, data.subject, data.html);
    }

    return data.emailIds;
  }

  static async sendMailToEmailIds(data) {
    await (0, _helper.mailer)(data.emailIds, data.subject, data.html);
    return data.emailIds;
  }

  static async listSentEmails(query, params) {
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
        _id: query._id // $or: [
        //     {
        //         subject: { $regex: '.*' + (query?.key || '') + '.*' }
        //     },
        //     {
        //         key: { $regex: '.*' + (query?.key || '') + '.*' }
        //     },
        // ],

      };
      (0, _helper.clearSearch)(search);
      const $aggregate = [{
        $match: search
      }, {
        $sort: {
          _id: -1
        }
      }, {
        "$project": {
          emailTemplate: 1,
          state: 1,
          district: 1,
          taluk: 1,
          serviceType: 1,
          to: 1,
          emailIds: 1,
          emailContent: 1
        }
      }];
      const counter = await _emailSent.default.aggregate([...$aggregate, {
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

      response.result.data = await _emailSent.default.aggregate([...$aggregate, {
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

}

exports.default = Service;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9FbWFpbFNlcnZpY2UuanMiXSwibmFtZXMiOlsidHJhbnNwb3J0ZXIiLCJub2RlbWFpbGVyIiwiY3JlYXRlVHJhbnNwb3J0Iiwic2VydmljZSIsImF1dGgiLCJ1c2VyIiwiQ29uZmlnIiwiZW1haWwiLCJpZCIsInBhc3MiLCJwYXNzd29yZCIsIlNlcnZpY2UiLCJsaXN0VGVtcGxhdGVzIiwicXVlcnkiLCJwYXJhbXMiLCJpc0FsbCIsInJlc3BvbnNlIiwic3RhdHVzQ29kZSIsIm1lc3NhZ2UiLCJyZXN1bHQiLCJkYXRhIiwicGFnZSIsImxpbWl0IiwidG90YWwiLCJzdGF0dXMiLCJzZWFyY2giLCJfaWQiLCIkb3IiLCJzdWJqZWN0IiwiJHJlZ2V4Iiwia2V5IiwiJGFnZ3JlZ2F0ZSIsIiRtYXRjaCIsIiRzb3J0IiwiaHRtbCIsImRlbGV0YWJsZSIsImNvdW50ZXIiLCJFbWFpbFRlbXBsYXRlTW9kZWwiLCJhZ2dyZWdhdGUiLCIkY291bnQiLCIkbGltaXQiLCIkc2tpcCIsImxlbmd0aCIsImUiLCJFcnJvciIsInNhdmVUZW1wbGF0ZSIsInRwbERhdGEiLCJmaW5kQnlJZCIsInNhdmUiLCJkZWxldGVUZW1wbGF0ZVBlcm1hbmVudCIsImNvbmQiLCJkZWxldGVPbmUiLCJzZW5kRW1haWwiLCJlbWFpbElkcyIsImVtYWlsVGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsInJlcGxhY2UiLCJ0byIsInNlbmRNYWlsVG9DdXN0b21lcnMiLCJzZW5kTWFpbFRvRHJpdmVycyIsInNlbmRNYWlsVG9BZG1pbnMiLCJzZW5kTWFpbFRvRW1haWxJZHMiLCJFbWFpbFNlbnRNb2RlbCIsImVtYWlsQ29udGVudCIsInN0YXRlIiwiZGlzdHJpY3QiLCJ0YWx1ayIsInNlcnZpY2VUeXBlIiwiaXNEZWxldGVkIiwibW9uZ29vc2UiLCJUeXBlcyIsIk9iamVjdElkIiwidXNlckRhdGFzIiwiQ3VzdG9tZXJNb2RlbCIsImZpbmQiLCJtYXAiLCJ2IiwiaW5jbHVkZXMiLCJmb3JFYWNoIiwidXNlckRhdGEiLCJmaW5kT25lIiwiZWpzIiwicmVuZGVyIiwiX2RvYyIsImVtYWlsRGF0YSIsIkRyaXZlck1vZGVsIiwiVXNlck1vZGVsIiwibGlzdFNlbnRFbWFpbHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLE1BQU1BLFdBQVcsR0FBR0Msb0JBQVdDLGVBQVgsQ0FBMkI7QUFDM0NDLEVBQUFBLE9BQU8sRUFBRSxPQURrQztBQUUzQ0MsRUFBQUEsSUFBSSxFQUFFO0FBQ0ZDLElBQUFBLElBQUksRUFBRUMsZ0JBQU9DLEtBQVAsQ0FBYUMsRUFEakI7QUFFRkMsSUFBQUEsSUFBSSxFQUFFSCxnQkFBT0MsS0FBUCxDQUFhRztBQUZqQjtBQUZxQyxDQUEzQixDQUFwQjs7QUFRZSxNQUFNQyxPQUFOLENBQWM7QUFFekI7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUk4QixlQUFiQyxhQUFhLENBQUNDLEtBQUQsRUFBUUMsTUFBUixFQUFnQjtBQUN0QyxVQUFNQyxLQUFLLEdBQUdELE1BQU0sQ0FBQ0MsS0FBUCxLQUFpQixLQUEvQjtBQUNBLFVBQU1DLFFBQVEsR0FBRztBQUNiQyxNQUFBQSxVQUFVLEVBQUUsR0FEQztBQUViQyxNQUFBQSxPQUFPLEVBQUUsaUJBRkk7QUFHYkMsTUFBQUEsTUFBTSxFQUFFO0FBQ0pDLFFBQUFBLElBQUksRUFBRSxFQURGO0FBRUpDLFFBQUFBLElBQUksRUFBRVIsS0FBSyxDQUFDUSxJQUFOLEdBQWEsQ0FBYixHQUFpQixDQUFqQixH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LENBQWdCQyxJQUFoQixDQUFxQnNCLE1BQXpCLEVBQWlDO0FBQzdCMUIsUUFBQUEsUUFBUSxDQUFDRSxPQUFULEdBQW1CLGNBQW5CO0FBQ0g7O0FBQ0RGLE1BQUFBLFFBQVEsQ0FBQ0MsVUFBVCxHQUFzQixHQUF0QjtBQUNBRCxNQUFBQSxRQUFRLENBQUNRLE1BQVQsR0FBa0IsSUFBbEI7QUFFQSxhQUFPUixRQUFQO0FBRUgsS0EzREQsQ0EyREUsT0FBTzJCLENBQVAsRUFBVTtBQUNSLFlBQU0sSUFBSUMsS0FBSixDQUFVRCxDQUFWLENBQU47QUFDSDtBQUNKOztBQWpZd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbm9kZW1haWxlciBmcm9tICdub2RlbWFpbGVyJztcclxuaW1wb3J0IGVqcyBmcm9tIFwiZWpzXCI7XHJcbmltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuaW1wb3J0IENvbmZpZyBmcm9tICcuLi91dGxzL2NvbmZpZyc7XHJcbi8vIGltcG9ydCBMb2dnZXIgZnJvbSAnLi4vdXRscy9Mb2dnZXInO1xyXG5pbXBvcnQgRW1haWxUZW1wbGF0ZU1vZGVsIGZyb20gJy4uL2RhdGEtYmFzZS9tb2RlbHMvZW1haWxUZW1wbGF0ZSc7XHJcbmltcG9ydCBFbWFpbFNlbnRNb2RlbCBmcm9tICcuLi9kYXRhLWJhc2UvbW9kZWxzL2VtYWlsU2VudCc7XHJcbmltcG9ydCBEcml2ZXJNb2RlbCBmcm9tICcuLi9kYXRhLWJhc2UvbW9kZWxzL2RyaXZlcic7XHJcbmltcG9ydCBDdXN0b21lck1vZGVsIGZyb20gJy4uL2RhdGEtYmFzZS9tb2RlbHMvY3VzdG9tZXInO1xyXG5pbXBvcnQge1VzZXJNb2RlbH0gZnJvbSAnLi4vZGF0YS1iYXNlL21vZGVscy91c2VyTW9kZWwnO1xyXG5pbXBvcnQgeyBjbGVhclNlYXJjaCwgbWFpbGVyIH0gZnJvbSAnLi4vdXRscy9faGVscGVyJztcclxuXHJcbmNvbnN0IHRyYW5zcG9ydGVyID0gbm9kZW1haWxlci5jcmVhdGVUcmFuc3BvcnQoe1xyXG4gICAgc2VydmljZTogJ2dtYWlsJyxcclxuICAgIGF1dGg6IHtcclxuICAgICAgICB1c2VyOiBDb25maWcuZW1haWwuaWQsXHJcbiAgICAgICAgcGFzczogQ29uZmlnLmVtYWlsLnBhc3N3b3JkXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZSB7XHJcblxyXG4gICAgLypcclxuICAgIHN0YXRpYyBhc3luYyBzZW5kRW1haWwodG8sIHN1YmplY3QsIGh0bWwpIHtcclxuXHJcbiAgICAgICAgY29uc3QgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGZyb206IENvbmZpZy5lbWFpbC5pZCxcclxuICAgICAgICAgICAgdG86IHRvLFxyXG4gICAgICAgICAgICBzdWJqZWN0OiBzdWJqZWN0LFxyXG4gICAgICAgICAgICBodG1sOiBodG1sXHJcbiAgICAgICAgfTtcclxuICAgIFxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cmFuc3BvcnRlci5zZW5kTWFpbChtYWlsT3B0aW9ucywgZnVuY3Rpb24gKGVycm9yLCBpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yIHdoaWxlIHNlbmRpbmcgbWFpbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG8gICBcdFx0XHQtICR7dG99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdWJqZWN0ICAgXHRcdC0gJHtzdWJqZWN0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhc29uICAgXHQgICAgLSAke2Vycm9yLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIExvZ2dlci5pbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBbiBlbWFpbCB3YXMgc2VudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVG8gICBcdFx0XHQtICR7dG99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdWJqZWN0ICAgXHRcdC0gJHtzdWJqZWN0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzcG9uc2UgXHQgICAgLSAke2luZm8ucmVzcG9uc2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNZXNzYWdlIElkIFx0ICAgIC0gJHtpbmZvLm1lc3NhZ2VJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluZm8gICAgICAgICAgICAtICR7aW5mb31cclxuICAgICAgICAgICAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgICovXHJcblxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBsaXN0VGVtcGxhdGVzKHF1ZXJ5LCBwYXJhbXMpIHtcclxuICAgICAgICBjb25zdCBpc0FsbCA9IHBhcmFtcy5pc0FsbCA9PT0gJ0FMTCc7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0RhdGEgbm90IGZvdW5kIScsXHJcbiAgICAgICAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICBwYWdlOiBxdWVyeS5wYWdlICogMSA+IDAgPyBxdWVyeS5wYWdlICogMSA6IDEsXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogcXVlcnkubGltaXQgKiAxID4gMCA/IHF1ZXJ5LmxpbWl0ICogMSA6IDIwLFxyXG4gICAgICAgICAgICAgICAgdG90YWw6IDAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YXR1czogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2ggPSB7XHJcbiAgICAgICAgICAgICAgICBfaWQ6IHF1ZXJ5Ll9pZCxcclxuICAgICAgICAgICAgICAgICRvcjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViamVjdDogeyAkcmVnZXg6ICcuKicgKyAocXVlcnk/LmtleSB8fCAnJykgKyAnLionIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiB7ICRyZWdleDogJy4qJyArIChxdWVyeT8ua2V5IHx8ICcnKSArICcuKicgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY2xlYXJTZWFyY2goc2VhcmNoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0ICRhZ2dyZWdhdGUgPSBbXHJcbiAgICAgICAgICAgICAgICB7ICRtYXRjaDogc2VhcmNoIH0sXHJcbiAgICAgICAgICAgICAgICB7ICRzb3J0OiB7IF9pZDogLTEgfSB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiJHByb2plY3RcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJqZWN0OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWw6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0YWJsZTogMSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY291bnRlciA9IGF3YWl0IEVtYWlsVGVtcGxhdGVNb2RlbC5hZ2dyZWdhdGUoWy4uLiRhZ2dyZWdhdGUsIHsgJGNvdW50OiBcInRvdGFsXCIgfV0pO1xyXG4gICAgICAgICAgICByZXNwb25zZS5yZXN1bHQudG90YWwgPSBjb3VudGVyWzBdPy50b3RhbDtcclxuICAgICAgICAgICAgaWYgKGlzQWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5yZXN1bHQucGFnZSA9IDE7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5yZXN1bHQubGltaXQgPSByZXNwb25zZS5yZXN1bHQudG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnRvdGFsID0gY291bnRlclswXT8udG90YWw7XHJcbiAgICAgICAgICAgIGlmIChpc0FsbCkge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnBhZ2UgPSAxO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LmxpbWl0ID0gcmVzcG9uc2UucmVzdWx0LnRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXNwb25zZS5yZXN1bHQuZGF0YSA9IGF3YWl0IEVtYWlsVGVtcGxhdGVNb2RlbC5hZ2dyZWdhdGUoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uJGFnZ3JlZ2F0ZSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRsaW1pdDogcmVzcG9uc2UucmVzdWx0LmxpbWl0ICsgcmVzcG9uc2UucmVzdWx0LmxpbWl0ICogKHJlc3BvbnNlLnJlc3VsdC5wYWdlIC0gMSkgfSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRza2lwOiByZXNwb25zZS5yZXN1bHQubGltaXQgKiAocmVzcG9uc2UucmVzdWx0LnBhZ2UgLSAxKSB9XHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXN1bHQuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkRhdGEgZmV0Y2hlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlVGVtcGxhdGUoZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IF9pZCA9IGRhdGEuX2lkO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdFcnJvciEnLCBzdGF0dXM6IGZhbHNlIH07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRwbERhdGEgPSBfaWQgPyBhd2FpdCBFbWFpbFRlbXBsYXRlTW9kZWwuZmluZEJ5SWQoX2lkKSA6IG5ldyBFbWFpbFRlbXBsYXRlTW9kZWwoKTtcclxuXHJcbiAgICAgICAgICAgIHRwbERhdGEuc3ViamVjdCA9IGRhdGEuc3ViamVjdDtcclxuICAgICAgICAgICAgdHBsRGF0YS5rZXkgPSBkYXRhLmtleTtcclxuICAgICAgICAgICAgdHBsRGF0YS5odG1sID0gZGF0YS5odG1sO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgdHBsRGF0YS5zYXZlKCk7XHJcblxyXG4gICAgICAgICAgICByZXNwb25zZS5tZXNzYWdlID0gX2lkID8gXCJFbWFpbCB0ZW1wbGF0ZSBpcyBVcGRhdGVkXCIgOiBcIkEgbmV3IGVtYWlsIHRlbXBsYXRlIGlzIGNyZWF0ZWRcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZVRlbXBsYXRlUGVybWFuZW50KF9pZCwgY29uZCkge1xyXG4gICAgICAgIGNvbmQgPSAhY29uZCA/IHt9IDogY29uZDtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IHsgc3RhdHVzQ29kZTogNDAwLCBtZXNzYWdlOiAnRXJyb3IhJywgc3RhdHVzOiBmYWxzZSB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCBFbWFpbFRlbXBsYXRlTW9kZWwuZGVsZXRlT25lKHsgX2lkLCAuLi5jb25kIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UubWVzc2FnZSA9IFwiRGVsZXRlZCBzdWNjZXNzZnVsbHlcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9IDIwMDtcclxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbiBub3QgZGVsZXRlLiBTb21ldGhpbmcgd2VudCB3cm9uZy5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBzZW5kRW1haWwoZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDAsIG1lc3NhZ2U6ICdFcnJvciEnLCBzdGF0dXM6IGZhbHNlIH07XHJcbiAgICAgICAgbGV0IGVtYWlsSWRzID0gW107XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGRhdGEuZW1haWxUZW1wbGF0ZSAhPT0gJ2N1c3RvbScpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXdhaXQgRW1haWxUZW1wbGF0ZU1vZGVsLmZpbmRCeUlkKGRhdGEuZW1haWxUZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBkYXRhLnN1YmplY3QgPSB0ZW1wbGF0ZS5zdWJqZWN0O1xyXG4gICAgICAgICAgICAgICAgZGF0YS5odG1sID0gdGVtcGxhdGUuaHRtbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhLmh0bWwgPSBkYXRhLmh0bWwucmVwbGFjZSgvJmx0OyU9L2csIFwiPCU9XCIpO1xyXG4gICAgICAgICAgICBkYXRhLmh0bWwgPSBkYXRhLmh0bWwucmVwbGFjZSgvJSZndDsvZywgXCIlPlwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhLnRvID09PSAnbWFueUN1c3RvbWVycycgfHwgZGF0YS50byA9PT0gJ2FsbEN1c3RvbWVycycpIHtcclxuICAgICAgICAgICAgICAgIGVtYWlsSWRzID0gYXdhaXQgdGhpcy5zZW5kTWFpbFRvQ3VzdG9tZXJzKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkYXRhLnRvID09PSAnbWFueURyaXZlcnMnIHx8IGRhdGEudG8gPT09ICdhbGxEcml2ZXJzJykge1xyXG4gICAgICAgICAgICAgICAgZW1haWxJZHMgPSBhd2FpdCB0aGlzLnNlbmRNYWlsVG9Ecml2ZXJzKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkYXRhLnRvID09PSAnbWFueUFkbWlucycgfHwgZGF0YS50byA9PT0gJ2FsbEFkbWlucycpIHtcclxuICAgICAgICAgICAgICAgIGVtYWlsSWRzID0gYXdhaXQgdGhpcy5zZW5kTWFpbFRvQWRtaW5zKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkYXRhLnRvID09PSAnY3VzdG9tJykge1xyXG4gICAgICAgICAgICAgICAgZW1haWxJZHMgPSBhd2FpdCB0aGlzLnNlbmRNYWlsVG9FbWFpbElkcyhkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdHBsRGF0YSA9IG5ldyBFbWFpbFNlbnRNb2RlbCgpO1xyXG5cclxuICAgICAgICAgICAgaWYoZGF0YS5lbWFpbFRlbXBsYXRlICE9PSAnY3VzdG9tJyl7XHJcbiAgICAgICAgICAgICAgICB0cGxEYXRhLmVtYWlsVGVtcGxhdGUgPSBkYXRhLmVtYWlsVGVtcGxhdGU7XHJcbiAgICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgICAgIHRwbERhdGEuZW1haWxDb250ZW50LnN1YmplY3QgPSBkYXRhLnN1YmplY3Q7XHJcbiAgICAgICAgICAgICAgICB0cGxEYXRhLmVtYWlsQ29udGVudC5odG1sID0gZGF0YS5odG1sO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGRhdGEuc3RhdGUpe1xyXG4gICAgICAgICAgICAgICAgdHBsRGF0YS5zdGF0ZSA9IGRhdGEuc3RhdGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoZGF0YS5kaXN0cmljdCl7XHJcbiAgICAgICAgICAgICAgICB0cGxEYXRhLmRpc3RyaWN0ID0gZGF0YS5kaXN0cmljdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihkYXRhLnRhbHVrKXtcclxuICAgICAgICAgICAgICAgIHRwbERhdGEudGFsdWsgPSBkYXRhLnRhbHVrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGRhdGEuc2VydmljZVR5cGUpe1xyXG4gICAgICAgICAgICAgICAgdHBsRGF0YS5zZXJ2aWNlVHlwZSA9IGRhdGEuc2VydmljZVR5cGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRwbERhdGEudG8gPSBkYXRhLnRvO1xyXG4gICAgICAgICAgICB0cGxEYXRhLmVtYWlsSWRzID0gZW1haWxJZHM7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0cGxEYXRhLnNhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSA0MDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkVtYWlsIHNlbnRcIjtcclxuICAgICAgICAgICAgcmVzcG9uc2UuZW1haWxJZHMgPSBlbWFpbElkcztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciB3aGlsZSBzZW5kaW5nIGVtYWlsISBQbGVhc2UgY2hlY2sgZW1haWwgdGVtcGxhdGUgb3IgY29tcG9zZWQgbWFpbFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIHNlbmRNYWlsVG9DdXN0b21lcnMoZGF0YSkge1xyXG4gICAgICAgIGlmIChkYXRhLnRvID09PSAnYWxsQ3VzdG9tZXJzJykge1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2ggPSB7XHJcbiAgICAgICAgICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc3RhdGU6IGRhdGEuc3RhdGUgPyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChkYXRhLnN0YXRlKSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgZGlzdHJpY3Q6IGRhdGEuZGlzdHJpY3QgPyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChkYXRhLmRpc3RyaWN0KSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgdGFsdWs6IGRhdGEudGFsdWsgPyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChkYXRhLnRhbHVrKSA6ICcnLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY2xlYXJTZWFyY2goc2VhcmNoKTtcclxuICAgICAgICAgICAgY29uc3QgdXNlckRhdGFzID0gYXdhaXQgQ3VzdG9tZXJNb2RlbC5maW5kKHNlYXJjaCk7XHJcbiAgICAgICAgICAgIGRhdGEuZW1haWxJZHMgPSB1c2VyRGF0YXMubWFwKHYgPT4gdi5lbWFpbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0YS5odG1sLmluY2x1ZGVzKCc8JT0nKSAmJiBkYXRhLmh0bWwuaW5jbHVkZXMoJyU+JykpIHtcclxuICAgICAgICAgICAgZGF0YS5lbWFpbElkcz8uZm9yRWFjaChhc3luYyAodikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlckRhdGEgPSBhd2FpdCBDdXN0b21lck1vZGVsLmZpbmRPbmUoeyBlbWFpbDogdiwgaXNEZWxldGVkOiBmYWxzZSB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBodG1sID0gYXdhaXQgZWpzLnJlbmRlcihkYXRhLmh0bWwsIHsgLi4udXNlckRhdGEuX2RvYywgLi4uZGF0YT8uZW1haWxEYXRhIH0pO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgbWFpbGVyKHYsIGRhdGEuc3ViamVjdCwgaHRtbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGF3YWl0IG1haWxlcihkYXRhLmVtYWlsSWRzLCBkYXRhLnN1YmplY3QsIGRhdGEuaHRtbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF0YS5lbWFpbElkcztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgc2VuZE1haWxUb0RyaXZlcnMoZGF0YSkge1xyXG4gICAgICAgIGlmIChkYXRhLnRvID09PSAnYWxsRHJpdmVycycpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0ge1xyXG4gICAgICAgICAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHN0YXRlOiBkYXRhLnN0YXRlID8gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoZGF0YS5zdGF0ZSkgOiAnJyxcclxuICAgICAgICAgICAgICAgIGRpc3RyaWN0OiBkYXRhLmRpc3RyaWN0ID8gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoZGF0YS5kaXN0cmljdCkgOiAnJyxcclxuICAgICAgICAgICAgICAgIHRhbHVrOiBkYXRhLnRhbHVrID8gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoZGF0YS50YWx1aykgOiAnJyxcclxuICAgICAgICAgICAgICAgIHNlcnZpY2VUeXBlOiBkYXRhLnNlcnZpY2VUeXBlID8gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoZGF0YS5zZXJ2aWNlVHlwZSkgOiAnJyxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFyU2VhcmNoKHNlYXJjaCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJEYXRhcyA9IGF3YWl0IERyaXZlck1vZGVsLmZpbmQoc2VhcmNoKTtcclxuICAgICAgICAgICAgZGF0YS5lbWFpbElkcyA9IHVzZXJEYXRhcy5tYXAodiA9PiB2LmVtYWlsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXRhLmh0bWwuaW5jbHVkZXMoJzwlPSBmaXJzdE5hbWUgJT4nKSB8fCBkYXRhLmh0bWwuaW5jbHVkZXMoJzwlPSBsYXN0TmFtZSAlPicpIHx8IGRhdGEuaHRtbC5pbmNsdWRlcygnPCU9IGVtYWlsICU+JykpIHtcclxuICAgICAgICAgICAgZGF0YS5lbWFpbElkcz8uZm9yRWFjaChhc3luYyAodikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlckRhdGEgPSBhd2FpdCBEcml2ZXJNb2RlbC5maW5kT25lKHsgZW1haWw6IHYsIGlzRGVsZXRlZDogZmFsc2UgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaHRtbCA9IGF3YWl0IGVqcy5yZW5kZXIoZGF0YS5odG1sLCB7IC4uLnVzZXJEYXRhLl9kb2MgfSk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBtYWlsZXIodiwgZGF0YS5zdWJqZWN0LCBodG1sKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXdhaXQgbWFpbGVyKGRhdGEuZW1haWxJZHMsIGRhdGEuc3ViamVjdCwgZGF0YS5odG1sKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhLmVtYWlsSWRzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBzZW5kTWFpbFRvQWRtaW5zKGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YS50byA9PT0gJ2FsbERyaXZlcnMnKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaCA9IHtcclxuICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzdGF0ZTogZGF0YS5zdGF0ZSA/IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGRhdGEuc3RhdGUpIDogJycsXHJcbiAgICAgICAgICAgICAgICBkaXN0cmljdDogZGF0YS5kaXN0cmljdCA/IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGRhdGEuZGlzdHJpY3QpIDogJycsXHJcbiAgICAgICAgICAgICAgICB0YWx1azogZGF0YS50YWx1ayA/IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGRhdGEudGFsdWspIDogJycsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjbGVhclNlYXJjaChzZWFyY2gpO1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyRGF0YXMgPSBhd2FpdCBVc2VyTW9kZWwuZmluZChzZWFyY2gpO1xyXG4gICAgICAgICAgICBkYXRhLmVtYWlsSWRzID0gdXNlckRhdGFzLm1hcCh2ID0+IHYuZW1haWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhdGEuaHRtbC5pbmNsdWRlcygnPCU9IGZpcnN0TmFtZSAlPicpIHx8IGRhdGEuaHRtbC5pbmNsdWRlcygnPCU9IGxhc3ROYW1lICU+JykgfHwgZGF0YS5odG1sLmluY2x1ZGVzKCc8JT0gZW1haWwgJT4nKSkge1xyXG4gICAgICAgICAgICBkYXRhLmVtYWlsSWRzPy5mb3JFYWNoKGFzeW5jICh2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyRGF0YSA9IGF3YWl0IFVzZXJNb2RlbC5maW5kT25lKHsgZW1haWw6IHYsIGlzRGVsZXRlZDogZmFsc2UgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaHRtbCA9IGF3YWl0IGVqcy5yZW5kZXIoZGF0YS5odG1sLCB7IC4uLnVzZXJEYXRhLl9kb2MgfSk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBtYWlsZXIodiwgZGF0YS5zdWJqZWN0LCBodG1sKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXdhaXQgbWFpbGVyKGRhdGEuZW1haWxJZHMsIGRhdGEuc3ViamVjdCwgZGF0YS5odG1sKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhLmVtYWlsSWRzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBzZW5kTWFpbFRvRW1haWxJZHMoZGF0YSkge1xyXG4gICAgICAgIGF3YWl0IG1haWxlcihkYXRhLmVtYWlsSWRzLCBkYXRhLnN1YmplY3QsIGRhdGEuaHRtbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhLmVtYWlsSWRzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBsaXN0U2VudEVtYWlscyhxdWVyeSwgcGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgaXNBbGwgPSBwYXJhbXMuaXNBbGwgPT09ICdBTEwnO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0ge1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdEYXRhIG5vdCBmb3VuZCEnLFxyXG4gICAgICAgICAgICByZXN1bHQ6IHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgICAgICAgcGFnZTogcXVlcnkucGFnZSAqIDEgPiAwID8gcXVlcnkucGFnZSAqIDEgOiAxLFxyXG4gICAgICAgICAgICAgICAgbGltaXQ6IHF1ZXJ5LmxpbWl0ICogMSA+IDAgPyBxdWVyeS5saW1pdCAqIDEgOiAyMCxcclxuICAgICAgICAgICAgICAgIHRvdGFsOiAwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdGF0dXM6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0ge1xyXG4gICAgICAgICAgICAgICAgX2lkOiBxdWVyeS5faWQsXHJcbiAgICAgICAgICAgICAgICAvLyAkb3I6IFtcclxuICAgICAgICAgICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHN1YmplY3Q6IHsgJHJlZ2V4OiAnLionICsgKHF1ZXJ5Py5rZXkgfHwgJycpICsgJy4qJyB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGtleTogeyAkcmVnZXg6ICcuKicgKyAocXVlcnk/LmtleSB8fCAnJykgKyAnLionIH1cclxuICAgICAgICAgICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gXSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFyU2VhcmNoKHNlYXJjaCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCAkYWdncmVnYXRlID0gW1xyXG4gICAgICAgICAgICAgICAgeyAkbWF0Y2g6IHNlYXJjaCB9LFxyXG4gICAgICAgICAgICAgICAgeyAkc29ydDogeyBfaWQ6IC0xIH0gfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcIiRwcm9qZWN0XCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWxUZW1wbGF0ZTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RyaWN0OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWx1azogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZVR5cGU6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbElkczogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWxDb250ZW50OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb3VudGVyID0gYXdhaXQgRW1haWxTZW50TW9kZWwuYWdncmVnYXRlKFsuLi4kYWdncmVnYXRlLCB7ICRjb3VudDogXCJ0b3RhbFwiIH1dKTtcclxuICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnRvdGFsID0gY291bnRlclswXT8udG90YWw7XHJcbiAgICAgICAgICAgIGlmIChpc0FsbCkge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LnBhZ2UgPSAxO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LmxpbWl0ID0gcmVzcG9uc2UucmVzdWx0LnRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC50b3RhbCA9IGNvdW50ZXJbMF0/LnRvdGFsO1xyXG4gICAgICAgICAgICBpZiAoaXNBbGwpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5wYWdlID0gMTtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnJlc3VsdC5saW1pdCA9IHJlc3BvbnNlLnJlc3VsdC50b3RhbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzcG9uc2UucmVzdWx0LmRhdGEgPSBhd2FpdCBFbWFpbFNlbnRNb2RlbC5hZ2dyZWdhdGUoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uJGFnZ3JlZ2F0ZSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRsaW1pdDogcmVzcG9uc2UucmVzdWx0LmxpbWl0ICsgcmVzcG9uc2UucmVzdWx0LmxpbWl0ICogKHJlc3BvbnNlLnJlc3VsdC5wYWdlIC0gMSkgfSxcclxuICAgICAgICAgICAgICAgICAgICB7ICRza2lwOiByZXNwb25zZS5yZXN1bHQubGltaXQgKiAocmVzcG9uc2UucmVzdWx0LnBhZ2UgLSAxKSB9XHJcbiAgICAgICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXN1bHQuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLm1lc3NhZ2UgPSBcIkRhdGEgZmV0Y2hlZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==