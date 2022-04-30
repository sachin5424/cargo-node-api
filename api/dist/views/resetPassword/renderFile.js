"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderCustomerResetPasswordForm = renderCustomerResetPasswordForm;
exports.renderDriverResetPasswordForm = renderDriverResetPasswordForm;
exports.renderVehicleOwnerResetPasswordForm = renderVehicleOwnerResetPasswordForm;

var _ejs = _interopRequireDefault(require("ejs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function renderCustomerResetPasswordForm(data) {
  return await _ejs.default.renderFile(_path.default.join(__dirname, 'customer.txt'), _objectSpread({}, data));
}

async function renderDriverResetPasswordForm(data) {
  return await _ejs.default.renderFile(_path.default.join(__dirname, 'driver.txt'), _objectSpread({}, data));
}

async function renderVehicleOwnerResetPasswordForm(data) {
  return await _ejs.default.renderFile(_path.default.join(__dirname, 'vehicleOwner.txt'), _objectSpread({}, data));
}