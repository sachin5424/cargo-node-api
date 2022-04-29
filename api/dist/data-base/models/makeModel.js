"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const MakeModelSchema = new _mongoose.Schema({
  make: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "make"
  },
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
const MakeModelModel = (0, _mongoose.model)('makeModel', MakeModelSchema);
var _default = MakeModelModel;
exports.default = _default;