"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helper = require("../utls/_helper");

var _state = _interopRequireDefault(require("../data-base/models/state"));

var _serviceType = _interopRequireDefault(require("../data-base/models/serviceType"));

var _wallet = _interopRequireDefault(require("../data-base/models/wallet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Service {
  static async listStates(query) {
    const response = {
      statusCode: 400,
      message: 'Data not found!',
      data: {
        docs: [],
        page: query.page * 1 > 0 ? query.page * 1 : 1,
        limit: query.limit * 1 > 0 ? query.limit * 1 : 200,
        totalDocs: 0
      },
      status: false
    };

    try {
      const search = {
        _id: query._id,
        isDeleted: false // name: {$regex: ".*" + query.name + ".*"} 

      };
      (0, _helper.clearSearch)(search);
      response.data.docs = await _state.default.find(search).select('-__v').limit(response.data.limit).skip(response.data.limit * (response.data.page - 1)).then(async function (data) {
        await _state.default.count(search).then(count => {
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

  static async listServiceType() {
    const response = {
      statusCode: 400,
      message: 'Data not found!',
      result: {
        data: []
      },
      status: false
    };

    try {
      response.result.data = await _serviceType.default.find().select({
        name: 1,
        key: 1
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

  static async updateWallet(data) {
    try {
      const wallet = await _wallet.default.findById(data.wallet);

      if (data.transactionType === 'credit') {
        wallet.amount = wallet.amount + data.amount;
      } else if (data.transactionType === 'debit') {
        wallet.amount = wallet.amount - data.amount;
      }

      await wallet.save();
    } catch (e) {
      throw new Error('Wallet can not be updated');
    }
  }

}

exports.default = Service;