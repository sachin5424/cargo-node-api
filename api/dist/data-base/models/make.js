"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const MakeSchema = new _mongoose.Schema({
  name: String,
  key: String,
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
const MakeModel = (0, _mongoose.model)('make', MakeSchema);
var _default = MakeModel;
exports.default = _default;