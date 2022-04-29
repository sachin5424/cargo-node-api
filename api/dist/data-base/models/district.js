"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const DistrictSchema = new _mongoose.Schema({
  name: String,
  state: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "state"
  },
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
const DistrictModel = (0, _mongoose.model)('district', DistrictSchema);
var _default = DistrictModel;
exports.default = _default;