"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidator = require("express-validator");

var _Service = _interopRequireDefault(require("./_Service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TripController {
  static async list(req, res) {
    try {
      const srvRes = await _Service.default.listTrip(req?.query, req.__cuser._doc);
      return res.status(srvRes.statusCode).json({
        srvRes
      });
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const errors = (0, _expressValidator.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }

      const srvRes = await _Service.default.saveCustomer(req.body);
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

exports.default = TripController;