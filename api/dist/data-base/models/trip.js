"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TripSchema = new _mongoose.Schema({
  tripCategory: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "trip_categories"
  },
  driver: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "driver"
  },
  customer: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "customer"
  },
  vehicle: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "vehicle"
  },
  pickupLocation: {
    name: String,
    latlong: String
  },
  destinationLocation: {
    name: String,
    latlong: String
  },
  dateTime: dateTime,
  status: {
    type: String,
    enum: ['driverComing', 'driverWaiting', 'cancel', 'complete']
  }
}, {
  timestamps: true
}); // TripSchema.pre('save', function (next) { return next(); });

TripSchema.pre('save', async function (next) {
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
const TripModel = (0, _mongoose.model)('trip', TripSchema);
var _default = TripModel;
exports.default = _default;