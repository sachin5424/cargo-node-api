"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _TripController = _interopRequireDefault(require("./TripController"));

var _Validations = require("./_Validations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/list', _Validations.tripListValidation, CustomerController.list);
var _default = router;
exports.default = _default;