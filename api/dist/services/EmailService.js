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