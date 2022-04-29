"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _Controller = _interopRequireDefault(require("./Controller"));

var _OnlyAdminValidations = require("../../../validation/OnlyAdminValidations");

var _validateAdmin = require("../../../middleware/validateAdmin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/list-modules', _Controller.default.listModules);
router.get('/list-modules/:isAll', _Controller.default.listModules);
router.post('/save-module', _validateAdmin.validateSuperAdmin, _Controller.default.saveModule);
router.delete('/delete-module/:_id', _validateAdmin.validateSuperAdmin, _Controller.default.deleteModule);
router.get('/admin-modules', _Controller.default.adminModules);
router.post('/save-admin-modules', _OnlyAdminValidations.adminModuleValidation, _Controller.default.saveAdminModules);
var _default = router;
exports.default = _default;