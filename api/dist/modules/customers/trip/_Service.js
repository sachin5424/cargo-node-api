"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _customer = _interopRequireDefault(require("../../../data-base/models/customer"));

var _customerLocation = _interopRequireDefault(require("../../../data-base/models/customerLocation"));

var _helper = require("../../../utls/_helper");

var _config = _interopRequireDefault(require("../../../utls/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Service {
  static async listTrip(query, cuser) {
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
        isDeleted: false
        /* ...getAdminFilter(cuser)  */

      };
      (0, _helper.clearSearch)(search);
      response.data.docs = await _customer.default.find(search).select('  -__v').limit(response.data.limit).skip(response.data.limit * (response.data.page - 1)).then(async function (data) {
        await _customer.default.count(search).then(count => {
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

  static async saveTrip(data) {
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
      tplData.password = data.password;
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

}

exports.default = Service;