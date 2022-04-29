"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const FareManagementSchema = new _mongoose.default.Schema({
  serviceType: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "serviceType"
  },
  rideType: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "rideType"
  },
  vehicleCategory: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "vehicleCategory"
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
  baseFare: {
    type: Number,
    default: 0
  },
  bookingFare: {
    type: Number,
    default: 0
  },
  perMinuteFare: Number,
  cancelCharge: {
    type: Number,
    default: 0
  },
  waitingCharge: {
    type: Number,
    default: 0
  },
  adminCommissionType: {
    type: String,
    enum: ['percentage', 'flat'],
    default: 'percentage'
  },
  adminCommissionValue: {
    type: Number,
    default: 10
  },
  perKMCharges: [{
    maxKM: Number,
    charge: Number
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const FareManagementModel = _mongoose.default.model('fareManagement', FareManagementSchema);

var _default = FareManagementModel;
exports.default = _default;