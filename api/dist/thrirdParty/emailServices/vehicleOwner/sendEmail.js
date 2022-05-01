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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90aHJpcmRQYXJ0eS9lbWFpbFNlcnZpY2VzL3ZlaGljbGVPd25lci9zZW5kRW1haWwuanMiXSwibmFtZXMiOlsic2VuZFNpZ251cE1haWwiLCJkYXRhIiwiZW5jRW1haWwiLCJlbWFpbCIsInVybCIsIkNvbmZpZyIsImJhc2V1cmxzIiwiZW1haWxWZXJpZmljYXRpb24iLCJ2ZWhpY2xlT3duZXIiLCJjb25maXJtVVJMIiwiaHRtbCIsImVqcyIsInJlbmRlckZpbGUiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsIkVtYWlsU2VydmljZSIsInNlbmRFbWFpbCIsImUiLCJMb2dnZXIiLCJlcnJvciIsIm1lc3NhZ2UiLCJFcnJvciIsInNlbmRSZXNldFBhc3N3b3JkTWFpbCIsInJlc2V0UGFzc3dvcmRVUkwiLCJyZXNldFBhc3N3b3JkIiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRU8sZUFBZUEsY0FBZixDQUE4QkMsSUFBOUIsRUFBb0M7QUFDdkMsTUFBRztBQUNDLFVBQU1DLFFBQVEsR0FBRyx5QkFBWUQsSUFBSSxDQUFDRSxLQUFqQixDQUFqQjtBQUNBLFVBQU1DLEdBQUcsR0FBR0MsZ0JBQU9DLFFBQVAsQ0FBZ0JDLGlCQUFoQixDQUFrQ0MsWUFBbEMsR0FBaUQsR0FBakQsR0FBdUROLFFBQW5FO0FBQ0FELElBQUFBLElBQUksbUNBQU9BLElBQVA7QUFBYVEsTUFBQUEsVUFBVSxFQUFFTDtBQUF6QixNQUFKO0FBQ0EsVUFBTU0sSUFBSSxHQUFHLE1BQU1DLGFBQUlDLFVBQUosQ0FBZUMsY0FBS0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLGFBQXJCLENBQWYsb0JBQXdEZCxJQUF4RCxFQUFuQjtBQUNBLFdBQU9lLHNCQUFhQyxTQUFiLENBQXVCaEIsSUFBSSxDQUFDRSxLQUE1QixFQUFtQywyQkFBbkMsRUFBZ0VPLElBQWhFLENBQVA7QUFDSCxHQU5ELENBTUUsT0FBTVEsQ0FBTixFQUFRO0FBQ05DLG9CQUFPQyxLQUFQLENBQ0s7QUFDYjtBQUNBLGtDQUFrQ0YsQ0FBQyxDQUFDRyxPQUFRO0FBQzVDLGFBSlE7O0FBTUEsVUFBTSxJQUFJQyxLQUFKLENBQVVKLENBQVYsQ0FBTjtBQUNIO0FBQ0o7O0FBRU0sZUFBZUsscUJBQWYsQ0FBcUN0QixJQUFyQyxFQUEyQztBQUM5QyxNQUFHO0FBQ0MsVUFBTXVCLGdCQUFnQixHQUFHbkIsZ0JBQU9DLFFBQVAsQ0FBZ0JtQixhQUFoQixDQUE4QmpCLFlBQTlCLEdBQTZDLEdBQTdDLEdBQW1EUCxJQUFJLENBQUN5QixHQUFqRjtBQUNBekIsSUFBQUEsSUFBSSxtQ0FBT0EsSUFBUDtBQUFhdUIsTUFBQUEsZ0JBQWdCLEVBQUVBO0FBQS9CLE1BQUo7QUFDQSxVQUFNZCxJQUFJLEdBQUcsTUFBTUMsYUFBSUMsVUFBSixDQUFlQyxjQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsb0JBQXJCLENBQWYsb0JBQStEZCxJQUEvRCxFQUFuQjtBQUNBLFdBQU9lLHNCQUFhQyxTQUFiLENBQXVCaEIsSUFBSSxDQUFDRSxLQUE1QixFQUFtQyxxQkFBbkMsRUFBMERPLElBQTFELENBQVA7QUFDSCxHQUxELENBS0UsT0FBTVEsQ0FBTixFQUFRO0FBQ05DLG9CQUFPQyxLQUFQLENBQ0s7QUFDYjtBQUNBLGtDQUFrQ0YsQ0FBQyxDQUFDRyxPQUFRO0FBQzVDLGFBSlE7O0FBTUEsVUFBTSxJQUFJQyxLQUFKLENBQVVKLENBQVYsQ0FBTjtBQUNIO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZWpzIGZyb20gXCJlanNcIjtcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBFbWFpbFNlcnZpY2UgZnJvbSBcIi4uLy4uLy4uL3NlcnZpY2VzL0VtYWlsU2VydmljZVwiO1xyXG5pbXBvcnQgTG9nZ2VyIGZyb20gXCIuLi8uLi8uLi91dGxzL0xvZ2dlclwiO1xyXG5pbXBvcnQgeyBlbmNyeXB0RGF0YSB9IGZyb20gXCIuLi8uLi8uLi91dGxzL19oZWxwZXJcIjtcclxuaW1wb3J0IENvbmZpZyBmcm9tIFwiLi4vLi4vLi4vdXRscy9jb25maWdcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kU2lnbnVwTWFpbChkYXRhKSB7XHJcbiAgICB0cnl7XHJcbiAgICAgICAgY29uc3QgZW5jRW1haWwgPSBlbmNyeXB0RGF0YShkYXRhLmVtYWlsKTtcclxuICAgICAgICBjb25zdCB1cmwgPSBDb25maWcuYmFzZXVybHMuZW1haWxWZXJpZmljYXRpb24udmVoaWNsZU93bmVyICsgXCIvXCIgKyBlbmNFbWFpbDtcclxuICAgICAgICBkYXRhID0gey4uLmRhdGEsIGNvbmZpcm1VUkw6IHVybH07XHJcbiAgICAgICAgY29uc3QgaHRtbCA9IGF3YWl0IGVqcy5yZW5kZXJGaWxlKHBhdGguam9pbihfX2Rpcm5hbWUsICdzaWdudXAuaHRtbCcpLCB7Li4uZGF0YX0pO1xyXG4gICAgICAgIHJldHVybiBFbWFpbFNlcnZpY2Uuc2VuZEVtYWlsKGRhdGEuZW1haWwsIFwiQWNjb3VudCBWZXJpZmljYXRpb24gTWFpbFwiLCBodG1sKTtcclxuICAgIH0gY2F0Y2goZSl7XHJcbiAgICAgICAgTG9nZ2VyLmVycm9yKFxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgICAgICAgICBFcnJvciB3aGlsZSByZW5kZXJpbmcgZW1haWwgdGVtcGxhdGVcclxuICAgICAgICAgICAgICAgIFJlYXNvbiAgIFx0ICAgIC0gJHtlLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICApO1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRSZXNldFBhc3N3b3JkTWFpbChkYXRhKSB7XHJcbiAgICB0cnl7XHJcbiAgICAgICAgY29uc3QgcmVzZXRQYXNzd29yZFVSTCA9IENvbmZpZy5iYXNldXJscy5yZXNldFBhc3N3b3JkLnZlaGljbGVPd25lciArIFwiL1wiICsgZGF0YS5rZXk7XHJcbiAgICAgICAgZGF0YSA9IHsuLi5kYXRhLCByZXNldFBhc3N3b3JkVVJMOiByZXNldFBhc3N3b3JkVVJMfTtcclxuICAgICAgICBjb25zdCBodG1sID0gYXdhaXQgZWpzLnJlbmRlckZpbGUocGF0aC5qb2luKF9fZGlybmFtZSwgJ3Jlc2V0UGFzc3dvcmQuaHRtbCcpLCB7Li4uZGF0YX0pO1xyXG4gICAgICAgIHJldHVybiBFbWFpbFNlcnZpY2Uuc2VuZEVtYWlsKGRhdGEuZW1haWwsIFwiUmVzZXQgWW91ciBQYXNzd29yZFwiLCBodG1sKTtcclxuICAgIH0gY2F0Y2goZSl7XHJcbiAgICAgICAgTG9nZ2VyLmVycm9yKFxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgICAgICAgICBFcnJvciB3aGlsZSByZW5kZXJpbmcgZW1haWwgdGVtcGxhdGVcclxuICAgICAgICAgICAgICAgIFJlYXNvbiAgIFx0ICAgIC0gJHtlLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICApO1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlKTtcclxuICAgIH1cclxufSJdfQ==