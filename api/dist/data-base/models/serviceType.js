"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const ServiceTypeSchema = new _mongoose.Schema({
  name: String,
  key: String
}, {
  timestamps: false
});
const ServiceTypeModel = (0, _mongoose.model)('serviceType', ServiceTypeSchema);
var _default = ServiceTypeModel;
exports.default = _default;