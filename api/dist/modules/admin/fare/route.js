"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _FareManagementConteroller = _interopRequireDefault(require("./FareManagementConteroller"));

var _validateAdmin = require("../../../middleware/validateAdmin");

var _FareValidations = require("../../../validation/FareValidations");

var _others = require("../../../middleware/others");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/list', checkFareManagementListAccess, _FareManagementConteroller.default.list);
router.get('/list/:isAll', checkFareManagementListAccess, _FareManagementConteroller.default.list);
router.post('/save', checkFareManagementSaveAccess, _FareValidations.fareManagementValidations, _others.formValidation, _FareManagementConteroller.default.save);
router.delete("/delete/:id", checkFareManagementDeleteAccess, _FareManagementConteroller.default.delete);

async function checkFareManagementListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewFareManagement');
}

;

async function checkFareManagementSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editFareManagement' : 'addFareManagement', true);
}

;

async function checkFareManagementDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteFareManagement');
}

;
var _default = router;
exports.default = _default;