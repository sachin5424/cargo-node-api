"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DriverSchema = new _mongoose.Schema({
  vehicle: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "vehicle"
  },
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
  driverId: {
    type: Number,
    unique: true
  },
  // name: String,
  firstName: String,
  lastName: String,
  phoneNo: String,
  email: String,
  otpVerified: {
    type: Boolean,
    default: false
  },
  password: String,
  dob: Date,
  address: String,
  zipcode: String,
  photo: String,
  drivingLicenceNumber: String,
  drivingLicenceNumberExpiryDate: Date,
  drivingLicencePhoto: String,
  adharNo: String,
  adharCardPhoto: String,
  panNo: String,
  panCardPhoto: String,
  badgeNo: String,
  badgePhoto: String,
  isOnline: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
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
}); // DriverSchema.pre('save', function (next) { return next(); });

DriverSchema.pre('save', async function (next) {
  try {
    if (this.password) {
      const salt = await _bcryptjs.default.genSalt(10);
      this.password = await _bcryptjs.default.hash(this.password, salt);
    }
  } catch (err) {
    next(err);
  }

  next();
});
const DriverModel = (0, _mongoose.model)('driver', DriverSchema);
var _default = DriverModel;
exports.default = _default;