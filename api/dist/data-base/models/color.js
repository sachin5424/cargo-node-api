"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const ColorSchema = new _mongoose.Schema({
  name: String,
  code: String,
  isDeleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
const ColorModel = (0, _mongoose.model)('color', ColorSchema);
var _default = ColorModel;
exports.default = _default;