"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const NotificationSchema = new _mongoose.Schema({
  state: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "state"
  },
  district: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "district"
  },
  taluk: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "taluk"
  },
  serviceType: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "serviceType"
  },
  to: {
    type: String,
    enum: ['manyCustomers', 'manyDrivers', 'manyAdmins', 'allCustomers', 'allDrivers', 'allAdmins']
  },
  userIds: [{
    type: _mongoose.Schema.Types.ObjectId
  }],
  content: {
    type: String
  }
}, {
  timestamps: true
});
const NotificationModel = (0, _mongoose.model)('notification', NotificationSchema);
var _default = NotificationModel;
exports.default = _default;