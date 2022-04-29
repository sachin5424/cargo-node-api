"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserTokenModel = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserTokenSchema = new _mongoose.default.Schema({
  email: {
    type: String
  },
  refreshToken: {
    type: String
  }
}, {
  timestamps: true
});

const UserTokenModel = _mongoose.default.model('user_token', UserTokenSchema);

exports.UserTokenModel = UserTokenModel;