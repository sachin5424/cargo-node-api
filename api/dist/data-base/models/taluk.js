"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const TalukSchema = new _mongoose.Schema({
  name: String,
  state: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "state"
  },
  district: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "district"
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
const TalukModel = (0, _mongoose.model)('taluk', TalukSchema);
var _default = TalukModel;
exports.default = _default;