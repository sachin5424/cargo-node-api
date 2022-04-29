"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendResetPasswordMail = sendResetPasswordMail;
exports.sendSignupMail = sendSignupMail;

var _ejs = _interopRequireDefault(require("ejs"));

var _path = _interopRequireDefault(require("path"));

var _EmailService = _interopRequireDefault(require("../../../services/EmailService"));

var _Logger = _interopRequireDefault(require("../../../utls/Logger"));

var _helper = require("../../../utls/_helper");

var _config = _interopRequireDefault(require("../../../utls/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function sendSignupMail(data) {
  try {
    const encEmail = (0, _helper.encryptData)(data.email);
    const url = _config.default.baseurls.emailVerification.vehicleOwner + "/" + encEmail;
    data = _objectSpread(_objectSpread({}, data), {}, {
      confirmURL: url
    });
    const html = await _ejs.default.renderFile(_path.default.join(__dirname, 'signup.html'), _objectSpread({}, data));
    return _EmailService.default.sendEmail(data.email, "Account Verification Mail", html);
  } catch (e) {
    _Logger.default.error(`
                Error while rendering email template
                Reason   	    - ${e.message}
            `);

    throw new Error(e);
  }
}

async function sendResetPasswordMail(data) {
  try {
    const resetPasswordURL = _config.default.baseurls.resetPassword.vehicleOwner + "/" + data.key;
    data = _objectSpread(_objectSpread({}, data), {}, {
      resetPasswordURL: resetPasswordURL
    });
    const html = await _ejs.default.renderFile(_path.default.join(__dirname, 'resetPassword.html'), _objectSpread({}, data));
    return _EmailService.default.sendEmail(data.email, "Reset Your Password", html);
  } catch (e) {
    _Logger.default.error(`
                Error while rendering email template
                Reason   	    - ${e.message}
            `);

    throw new Error(e);
  }
}