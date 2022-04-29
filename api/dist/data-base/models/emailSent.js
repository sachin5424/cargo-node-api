"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const EmailSentSchema = new _mongoose.Schema({
  emailTemplate: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "emailTemplate"
  },
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
    enum: ['manyCustomers', 'manyDrivers', 'manyAdmins', 'allCustomers', 'allDrivers', 'allAdmins', 'custom']
  },
  emailIds: [{
    type: String
  }],
  emailContent: {
    subject: String,
    html: String
  }
}, {
  timestamps: true
});
const EmailSentModel = (0, _mongoose.model)('emailSent', EmailSentSchema);
var _default = EmailSentModel;
exports.default = _default;