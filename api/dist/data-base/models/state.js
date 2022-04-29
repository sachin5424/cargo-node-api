"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const StateSchema = new _mongoose.Schema({
  name: String,
  isActive: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: false
});
const StateModel = (0, _mongoose.model)('state', StateSchema);
var _default = StateModel;
exports.default = _default;