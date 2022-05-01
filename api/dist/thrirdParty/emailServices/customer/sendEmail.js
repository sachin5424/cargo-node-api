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
    const url = _config.default.baseurls.emailVerification.customer + "/" + encEmail;
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
    const resetPasswordURL = _config.default.baseurls.resetPassword.customer + "/" + data.key;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90aHJpcmRQYXJ0eS9lbWFpbFNlcnZpY2VzL2N1c3RvbWVyL3NlbmRFbWFpbC5qcyJdLCJuYW1lcyI6WyJzZW5kU2lnbnVwTWFpbCIsImRhdGEiLCJlbmNFbWFpbCIsImVtYWlsIiwidXJsIiwiQ29uZmlnIiwiYmFzZXVybHMiLCJlbWFpbFZlcmlmaWNhdGlvbiIsImN1c3RvbWVyIiwiY29uZmlybVVSTCIsImh0bWwiLCJlanMiLCJyZW5kZXJGaWxlIiwicGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJFbWFpbFNlcnZpY2UiLCJzZW5kRW1haWwiLCJlIiwiTG9nZ2VyIiwiZXJyb3IiLCJtZXNzYWdlIiwiRXJyb3IiLCJzZW5kUmVzZXRQYXNzd29yZE1haWwiLCJyZXNldFBhc3N3b3JkVVJMIiwicmVzZXRQYXNzd29yZCIsImtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVPLGVBQWVBLGNBQWYsQ0FBOEJDLElBQTlCLEVBQW9DO0FBQ3ZDLE1BQUc7QUFDQyxVQUFNQyxRQUFRLEdBQUcseUJBQVlELElBQUksQ0FBQ0UsS0FBakIsQ0FBakI7QUFDQSxVQUFNQyxHQUFHLEdBQUdDLGdCQUFPQyxRQUFQLENBQWdCQyxpQkFBaEIsQ0FBa0NDLFFBQWxDLEdBQTZDLEdBQTdDLEdBQW1ETixRQUEvRDtBQUNBRCxJQUFBQSxJQUFJLG1DQUFPQSxJQUFQO0FBQWFRLE1BQUFBLFVBQVUsRUFBRUw7QUFBekIsTUFBSjtBQUNBLFVBQU1NLElBQUksR0FBRyxNQUFNQyxhQUFJQyxVQUFKLENBQWVDLGNBQUtDLElBQUwsQ0FBVUMsU0FBVixFQUFxQixhQUFyQixDQUFmLG9CQUF3RGQsSUFBeEQsRUFBbkI7QUFDQSxXQUFPZSxzQkFBYUMsU0FBYixDQUF1QmhCLElBQUksQ0FBQ0UsS0FBNUIsRUFBbUMsMkJBQW5DLEVBQWdFTyxJQUFoRSxDQUFQO0FBQ0gsR0FORCxDQU1FLE9BQU1RLENBQU4sRUFBUTtBQUNOQyxvQkFBT0MsS0FBUCxDQUNLO0FBQ2I7QUFDQSxrQ0FBa0NGLENBQUMsQ0FBQ0csT0FBUTtBQUM1QyxhQUpROztBQU1BLFVBQU0sSUFBSUMsS0FBSixDQUFVSixDQUFWLENBQU47QUFDSDtBQUNKOztBQUVNLGVBQWVLLHFCQUFmLENBQXFDdEIsSUFBckMsRUFBMkM7QUFDOUMsTUFBRztBQUNDLFVBQU11QixnQkFBZ0IsR0FBR25CLGdCQUFPQyxRQUFQLENBQWdCbUIsYUFBaEIsQ0FBOEJqQixRQUE5QixHQUF5QyxHQUF6QyxHQUErQ1AsSUFBSSxDQUFDeUIsR0FBN0U7QUFDQXpCLElBQUFBLElBQUksbUNBQU9BLElBQVA7QUFBYXVCLE1BQUFBLGdCQUFnQixFQUFFQTtBQUEvQixNQUFKO0FBQ0EsVUFBTWQsSUFBSSxHQUFHLE1BQU1DLGFBQUlDLFVBQUosQ0FBZUMsY0FBS0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLG9CQUFyQixDQUFmLG9CQUErRGQsSUFBL0QsRUFBbkI7QUFDQSxXQUFPZSxzQkFBYUMsU0FBYixDQUF1QmhCLElBQUksQ0FBQ0UsS0FBNUIsRUFBbUMscUJBQW5DLEVBQTBETyxJQUExRCxDQUFQO0FBQ0gsR0FMRCxDQUtFLE9BQU1RLENBQU4sRUFBUTtBQUNOQyxvQkFBT0MsS0FBUCxDQUNLO0FBQ2I7QUFDQSxrQ0FBa0NGLENBQUMsQ0FBQ0csT0FBUTtBQUM1QyxhQUpROztBQU1BLFVBQU0sSUFBSUMsS0FBSixDQUFVSixDQUFWLENBQU47QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVqcyBmcm9tIFwiZWpzXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgRW1haWxTZXJ2aWNlIGZyb20gXCIuLi8uLi8uLi9zZXJ2aWNlcy9FbWFpbFNlcnZpY2VcIjtcclxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi4vLi4vLi4vdXRscy9Mb2dnZXJcIjtcclxuaW1wb3J0IHsgZW5jcnlwdERhdGEgfSBmcm9tIFwiLi4vLi4vLi4vdXRscy9faGVscGVyXCI7XHJcbmltcG9ydCBDb25maWcgZnJvbSBcIi4uLy4uLy4uL3V0bHMvY29uZmlnXCI7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFNpZ251cE1haWwoZGF0YSkge1xyXG4gICAgdHJ5e1xyXG4gICAgICAgIGNvbnN0IGVuY0VtYWlsID0gZW5jcnlwdERhdGEoZGF0YS5lbWFpbCk7XHJcbiAgICAgICAgY29uc3QgdXJsID0gQ29uZmlnLmJhc2V1cmxzLmVtYWlsVmVyaWZpY2F0aW9uLmN1c3RvbWVyICsgXCIvXCIgKyBlbmNFbWFpbDtcclxuICAgICAgICBkYXRhID0gey4uLmRhdGEsIGNvbmZpcm1VUkw6IHVybH07XHJcbiAgICAgICAgY29uc3QgaHRtbCA9IGF3YWl0IGVqcy5yZW5kZXJGaWxlKHBhdGguam9pbihfX2Rpcm5hbWUsICdzaWdudXAuaHRtbCcpLCB7Li4uZGF0YX0pO1xyXG4gICAgICAgIHJldHVybiBFbWFpbFNlcnZpY2Uuc2VuZEVtYWlsKGRhdGEuZW1haWwsIFwiQWNjb3VudCBWZXJpZmljYXRpb24gTWFpbFwiLCBodG1sKTtcclxuICAgIH0gY2F0Y2goZSl7XHJcbiAgICAgICAgTG9nZ2VyLmVycm9yKFxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgICAgICAgICBFcnJvciB3aGlsZSByZW5kZXJpbmcgZW1haWwgdGVtcGxhdGVcclxuICAgICAgICAgICAgICAgIFJlYXNvbiAgIFx0ICAgIC0gJHtlLm1lc3NhZ2V9XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICApO1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRSZXNldFBhc3N3b3JkTWFpbChkYXRhKSB7XHJcbiAgICB0cnl7XHJcbiAgICAgICAgY29uc3QgcmVzZXRQYXNzd29yZFVSTCA9IENvbmZpZy5iYXNldXJscy5yZXNldFBhc3N3b3JkLmN1c3RvbWVyICsgXCIvXCIgKyBkYXRhLmtleTtcclxuICAgICAgICBkYXRhID0gey4uLmRhdGEsIHJlc2V0UGFzc3dvcmRVUkw6IHJlc2V0UGFzc3dvcmRVUkx9O1xyXG4gICAgICAgIGNvbnN0IGh0bWwgPSBhd2FpdCBlanMucmVuZGVyRmlsZShwYXRoLmpvaW4oX19kaXJuYW1lLCAncmVzZXRQYXNzd29yZC5odG1sJyksIHsuLi5kYXRhfSk7XHJcbiAgICAgICAgcmV0dXJuIEVtYWlsU2VydmljZS5zZW5kRW1haWwoZGF0YS5lbWFpbCwgXCJSZXNldCBZb3VyIFBhc3N3b3JkXCIsIGh0bWwpO1xyXG4gICAgfSBjYXRjaChlKXtcclxuICAgICAgICBMb2dnZXIuZXJyb3IoXHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgIEVycm9yIHdoaWxlIHJlbmRlcmluZyBlbWFpbCB0ZW1wbGF0ZVxyXG4gICAgICAgICAgICAgICAgUmVhc29uICAgXHQgICAgLSAke2UubWVzc2FnZX1cclxuICAgICAgICAgICAgYFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGUpO1xyXG4gICAgfVxyXG59Il19