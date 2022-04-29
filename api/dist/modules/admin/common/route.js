"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _CommonController = _interopRequireDefault(require("./CommonController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/list-states', _CommonController.default.listStates);
router.get('/list-service-type', _CommonController.default.listServiceType);
router.get('/init-db', _CommonController.default.initdb);
var _default = router;
exports.default = _default;