"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = new _mongoose.default.Schema({
  title: String,
  key: String
}, {
  timestamps: false
});

const ModuleModel = _mongoose.default.model('module', Schema);

var _default = ModuleModel;
exports.default = _default;