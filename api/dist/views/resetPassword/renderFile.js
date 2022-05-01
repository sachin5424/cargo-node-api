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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92aWV3cy9yZXNldFBhc3N3b3JkL3JlbmRlckZpbGUuanMiXSwibmFtZXMiOlsicmVuZGVyQ3VzdG9tZXJSZXNldFBhc3N3b3JkRm9ybSIsImRhdGEiLCJlanMiLCJyZW5kZXJGaWxlIiwicGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJyZW5kZXJEcml2ZXJSZXNldFBhc3N3b3JkRm9ybSIsInJlbmRlclZlaGljbGVPd25lclJlc2V0UGFzc3dvcmRGb3JtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7OztBQUVPLGVBQWVBLCtCQUFmLENBQStDQyxJQUEvQyxFQUFvRDtBQUN2RCxTQUFPLE1BQU1DLGFBQUlDLFVBQUosQ0FBZUMsY0FBS0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLGNBQXJCLENBQWYsb0JBQXlETCxJQUF6RCxFQUFiO0FBQ0g7O0FBRU0sZUFBZU0sNkJBQWYsQ0FBNkNOLElBQTdDLEVBQWtEO0FBQ3JELFNBQU8sTUFBTUMsYUFBSUMsVUFBSixDQUFlQyxjQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsWUFBckIsQ0FBZixvQkFBdURMLElBQXZELEVBQWI7QUFDSDs7QUFFTSxlQUFlTyxtQ0FBZixDQUFtRFAsSUFBbkQsRUFBd0Q7QUFDM0QsU0FBTyxNQUFNQyxhQUFJQyxVQUFKLENBQWVDLGNBQUtDLElBQUwsQ0FBVUMsU0FBVixFQUFxQixrQkFBckIsQ0FBZixvQkFBNkRMLElBQTdELEVBQWI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlanMgZnJvbSBcImVqc1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlckN1c3RvbWVyUmVzZXRQYXNzd29yZEZvcm0oZGF0YSl7XHJcbiAgICByZXR1cm4gYXdhaXQgZWpzLnJlbmRlckZpbGUocGF0aC5qb2luKF9fZGlybmFtZSwgJ2N1c3RvbWVyLnR4dCcpLCB7Li4uZGF0YX0pO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVuZGVyRHJpdmVyUmVzZXRQYXNzd29yZEZvcm0oZGF0YSl7XHJcbiAgICByZXR1cm4gYXdhaXQgZWpzLnJlbmRlckZpbGUocGF0aC5qb2luKF9fZGlybmFtZSwgJ2RyaXZlci50eHQnKSwgey4uLmRhdGF9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlclZlaGljbGVPd25lclJlc2V0UGFzc3dvcmRGb3JtKGRhdGEpe1xyXG4gICAgcmV0dXJuIGF3YWl0IGVqcy5yZW5kZXJGaWxlKHBhdGguam9pbihfX2Rpcm5hbWUsICd2ZWhpY2xlT3duZXIudHh0JyksIHsuLi5kYXRhfSk7XHJcbn0iXX0=