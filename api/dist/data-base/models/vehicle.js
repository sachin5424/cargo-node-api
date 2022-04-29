"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const VehicleSchema = new _mongoose.Schema({
  serviceType: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "serviceType"
  },
  rideTypes: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: "rideType"
  }],
  vehicleCategory: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "vehicleCategory"
  },
  // driver: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'driver',
  // },
  state: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "state"
  },
  district: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "district"
  },
  taluk: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "taluk"
  },
  make: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "make"
  },
  model: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "makeModel"
  },
  color: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "color"
  },
  vehicleId: {
    type: Number,
    unique: true
  },
  name: String,
  vehicleNumber: String,
  availableSeats: Number,
  availableCapacity: Number,
  manufacturingYear: Number,
  primaryPhoto: String,
  otherPhotos: [{
    type: String
  }],
  registrationNumber: String,
  registrationExpiryDate: Date,
  registrationPhoto: String,
  insuranceNumber: String,
  insuranceExpiryDate: Date,
  insurancePhoto: String,
  permitNumber: String,
  permitExpiryDate: Date,
  permitPhoto: String,
  pollutionNumber: String,
  pollutionExpiryDate: Date,
  pollutionPhoto: String,
  isApproved: {
    type: Boolean,
    default: false
  },
  addedBy: {
    type: String,
    enum: ['admin', 'driver'],
    default: 'driver'
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
}); // VehicleSchema.pre('save', function (next) { return next(); });

const VehicleModel = (0, _mongoose.model)('vehicle', VehicleSchema);
var _default = VehicleModel;
exports.default = _default;