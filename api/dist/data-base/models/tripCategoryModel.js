"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tripCategorieModel = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _moment = _interopRequireDefault(require("moment"));

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Scheam = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  icon: {
    type: String,
    default: null
  },
  active: {
    type: Number,
    default: 1
  },
  slug: {
    type: String
  },
  isdeleted: {
    type: Number,
    default: 0
  },
  activeLog: [{
    userId: {
      type: _mongoose.default.Schema.Types.ObjectId,
      ref: "users"
    },
    method: {
      type: String,
      enum: ['GET', 'POST', 'DELETED', 'UPDATE']
    },
    oldData: {
      type: String,
      default: null
    },
    newData: {
      type: String,
      default: null
    },
    time: {
      type: Date,
      default: (0, _moment.default)()
    }
  }]
}, {
  timestamps: true
});
Scheam.plugin(_mongoosePaginateV.default);

const tripCategorieModel = _mongoose.default.model('trip_categories', Scheam);

exports.tripCategorieModel = tripCategorieModel;