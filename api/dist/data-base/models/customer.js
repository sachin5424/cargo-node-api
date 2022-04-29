"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CustomerSchema = new _mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNo: String,
  email: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  password: String,
  dob: Date,
  photo: String,
  address: String,
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
  zipcode: String,
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
}); // CustomerSchema.pre('save', function (next) { return next(); });

CustomerSchema.pre('save', async function (next) {
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
const CustomerModel = (0, _mongoose.model)('customer', CustomerSchema);
var _default = CustomerModel;
exports.default = _default;