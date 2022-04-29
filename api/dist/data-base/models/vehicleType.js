"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const VehicleTypeSchema = new _mongoose.Schema({
  name: String,
  icon: String,
  priceKM: Number,
  tripCategories: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'trip_categories'
  }],
  vehicleCategory: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'vehhical_categories'
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
}); // VehicleTypeSchema.pre('save', function (next) { return next(); });

const VehicleTypeModel = (0, _mongoose.model)('vehicleType', VehicleTypeSchema);
var _default = VehicleTypeModel;
exports.default = _default;