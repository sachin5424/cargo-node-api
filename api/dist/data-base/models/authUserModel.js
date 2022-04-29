"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserAuthPermission = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = new _mongoose.default.Schema({
  title: {
    type: String
  },
  model_name: {
    type: String
  },
  method: {
    type: String
  }
}, {
  timestamps: true
});

const UserAuthPermission = _mongoose.default.model('user_auth_permissions', Schema);

exports.UserAuthPermission = UserAuthPermission;