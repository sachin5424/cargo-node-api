"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _customer = _interopRequireDefault(require("../data-base/models/customer"));

var _customerLocation = _interopRequireDefault(require("../data-base/models/customerLocation"));

var _helper = require("../utls/_helper");

var _config = _interopRequireDefault(require("../utls/config"));

var _sendEmail = require("../thrirdParty/emailServices/customer/sendEmail");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Service {
  static async customerLogin(data) {
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };
    const email = data.email;
    const password = data.password;

    try {
      const owner = await _customer.default.findOne({
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
      const owner = await _customer.default.findOne({
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
      const tplData = await _customer.default.findOne({
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
      const tplData = await _customer.default.findOne({
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

  static async listCustomer(query, params) {
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
      isActive: query?.isActive ? query.isActive ? true : false : ''
    };

    try {
      const search = _objectSpread({
        _id: query._id,
        isDeleted: false,
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

      (0, _helper.clearSearch)(search);
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
          dob: 1,
          address: 1,
          state: 1,
          district: 1,
          taluk: 1,
          zipcode: 1,
          isActive: 1,
          image: {
            url: {
              $concat: [_config.default.applicationFileUrl + 'customer/photo/', "$photo"]
            },
            name: "$photo"
          }
        }
      }];
      const counter = await _customer.default.aggregate([...$aggregate, {
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

      response.result.data = await _customer.default.aggregate([...$aggregate, {
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

  static async saveCustomer(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _customer.default.findById(_id) : new _customer.default();
      tplData.firstName = data.firstName;
      tplData.lastName = data.lastName;
      tplData.phoneNo = data.phoneNo;
      tplData.email = data.email;
      !data.password || (tplData.password = data.password);
      tplData.dob = data.dob;
      tplData.photo = await (0, _helper.uploadFile)(data.photo, _config.default.uploadPaths.customer.photo, _customer.default, 'photo', _id);
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

  static async deleteCustomer(_id, cond) {
    (0, _helper.clearSearch)({
      cond
    });
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _customer.default.updateOne(_objectSpread({
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

  static async deleteCustomerPermanent(cond) {
    await _customer.default.deleteOne(_objectSpread({}, cond));
  }

  static async listLocation(query, customer) {
    const response = {
      statusCode: 400,
      message: 'Data not found!',
      data: {
        docs: [],
        page: query.page * 1 > 0 ? query.page * 1 : 1,
        limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
        totalDocs: 0
      },
      status: false
    };

    try {
      const search = {
        _id: query._id,
        isDeleted: false,
        customer
      };
      (0, _helper.clearSearch)(search);
      response.data.docs = await _customerLocation.default.find(search).select('  -__v').limit(response.data.limit).skip(response.data.limit * (response.data.page - 1)).then(async function (data) {
        await _customerLocation.default.count(search).then(count => {
          response.data.totalDocs = count;
        }).catch(err => {
          response.data.totalDocs = 0;
        });
        return data;
      }).catch(err => {
        throw new Error(err.message);
      });

      if (response.data.docs.length) {
        response.message = "Data fetched";
      }

      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async saveLocation(data) {
    const _id = data._id;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      const tplData = _id ? await _customerLocation.default.findById(_id) : new _customerLocation.default();
      tplData.customer = data.customer;
      tplData.name = data.name;
      tplData.latlong = data.latlong;
      await tplData.save();
      response.message = _id ? "Location is Updated" : "A new location is added";
      response.statusCode = 200;
      response.status = true;
      return response;
    } catch (e) {
      throw new Error(e);
    }
  }

  static async deleteLocation(_id, cond) {
    cond = !cond ? {} : cond;
    const response = {
      statusCode: 400,
      message: 'Error!',
      status: false
    };

    try {
      await _customerLocation.default.updateOne(_objectSpread({
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