"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const adminModulesSchema = new _mongoose.Schema({
  typeName: String,
  typeKey: String,
  grantedModules: [{
    type: String
  }]
}, {
  timestamps: false
});
const AdminModulesModel = (0, _mongoose.model)('adminModules', adminModulesSchema);
var _default = AdminModulesModel;
exports.default = _default;