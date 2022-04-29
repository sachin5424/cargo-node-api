"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rideTypeScheam = new _mongoose.default.Schema({
  serviceType: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "serviceType"
  },
  allowedVehicleCategories: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "vehicleCategory"
  }],
  name: String,
  key: String,
  photo: String,
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const RideTypeModel = _mongoose.default.model('rideType', rideTypeScheam);

var _default = RideTypeModel;
exports.default = _default;