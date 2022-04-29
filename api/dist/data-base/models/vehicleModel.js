"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const vehicleModel = new _mongoose.Schema({
  name: String,
  description: String,
  vehicleType: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'vehicleType'
  },
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
}); // vehicleModel.pre('save', function (next) { return next(); });

const VehicleModelModel = (0, _mongoose.model)('vehicleModel', vehicleModel);
var _default = VehicleModelModel;
exports.default = _default;