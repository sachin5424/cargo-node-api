"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const EmailTemplateSchema = new _mongoose.Schema({
  subject: String,
  key: {
    type: String,
    unique: true
  },
  html: String,
  deletable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
const EmailTemplateModel = (0, _mongoose.model)('emailTemplate', EmailTemplateSchema);
var _default = EmailTemplateModel;
exports.default = _default;