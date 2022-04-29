"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CustomerLocationSchema = new _mongoose.Schema({
  customer: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "customer"
  },
  name: String,
  latlong: String,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
const CustomerLocationModel = (0, _mongoose.model)('customerLocation', CustomerLocationSchema);
var _default = CustomerLocationModel;
exports.default = _default;