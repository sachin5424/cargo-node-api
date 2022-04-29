"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidator = require("express-validator");

var _DriverService = _interopRequireDefault(require("../../../services/DriverService"));

var _helper = require("../../../utls/_helper");

var _renderFile = require("../../../views/resetPassword/renderFile");

var _config = _interopRequireDefault(require("../../../utls/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserController {
  static async login(req, res) {
    try {
      const errors = (0, _expressValidator.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }

      const srvRes = await _DriverService.default.driverLogin(req.body);
      return res.status(srvRes.statusCode).json({
        srvRes
      });
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async verifyEmail(req, res) {
    try {
      let email = '';

      try {
        email = (0, _helper.decryptData)(req.params.email);
      } catch (e) {
        throw new Error('Invalid path');
      }

      const srvRes = await _DriverService.default.verifyEmail(email);
      return res.status(srvRes.statusCode).json({
        srvRes
      });
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async genForgetPasswordUrl(req, res) {
    try {
      const email = req.params.email;
      const srvRes = await _DriverService.default.genForgetPasswordUrl(email);
      return res.status(srvRes.statusCode).json({
        srvRes
      });
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async resetPasswordForm(req, res) {
    try {
      const originalUrl = req.originalUrl;
      const callbackUrl = _config.default.applicationBaseUrl;
      const callbackUrlText = 'Login Here';
      const html = await (0, _renderFile.renderDriverResetPasswordForm)({
        originalUrl,
        callbackUrl,
        callbackUrlText
      });
      res.setHeader('Content-Type', 'text/html').send(html);
    } catch (e) {
      return res.status(400).send({
        message: 'Error try again!'
      });
    }
  }

  static async resetPAssword(req, res) {
    try {
      const errors = (0, _expressValidator.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }

      const key = req.params.key;
      const srvRes = await _DriverService.default.resetPAssword(key, req.body);
      return res.status(srvRes.statusCode).json({
        srvRes
      });
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = UserController;