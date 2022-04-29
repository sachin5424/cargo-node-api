"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _PermissionController = _interopRequireDefault(require("./PermissionController"));

var _jwtToken = require("../../../middleware/jwtToken");

var _modelPermission = require("../../../validation/model-permission");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/test', _jwtToken.jwtTokenPermission, _PermissionController.default.get);
router.get('/', _PermissionController.default.getPermission);
router.post('/', _modelPermission.addPermission, _PermissionController.default.addPermission);
router.post('/multi', _PermissionController.default.addMultiPermission); // router.post('/',PermissionController.validations.addMultiPermission,PermissionController.addMultiPermission)

var _default = router;
exports.default = _default;