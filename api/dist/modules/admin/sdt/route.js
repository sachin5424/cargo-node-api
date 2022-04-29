"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _jwtToken = require("../../../middleware/jwtToken");

var _SDTController = _interopRequireDefault(require("./SDTController"));

var _StateController = _interopRequireDefault(require("./StateController"));

var _DistrictController = _interopRequireDefault(require("./DistrictController"));

var _TalukController = _interopRequireDefault(require("./TalukController"));

var _validateAdmin = require("../../../middleware/validateAdmin");

var _SDTValidation = require("../../../validation/SDTValidation");

var _others = require("../../../middleware/others");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/sdt', _jwtToken.jwtTokenPermission, _SDTController.default.sdtList);
router.get('/state/list', _jwtToken.jwtTokenPermission, checkStateViewAccess, _StateController.default.list);
router.get('/state/list/:isAll', _jwtToken.jwtTokenPermission, checkStateViewAccess, _StateController.default.list);
router.post("/state/save", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdmin, checkStateSaveAccess, _SDTValidation.stateValidation, _others.formValidation, _StateController.default.save);
router.delete("/state/delete/:id", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdmin, CheckStateDeleteAccess, _StateController.default.delete);
router.get('/district/list', _jwtToken.jwtTokenPermission, checkDistrictViewAccess, _DistrictController.default.list);
router.get('/district/list/:isAll', _jwtToken.jwtTokenPermission, checkDistrictViewAccess, _DistrictController.default.list);
router.post("/district/save", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdminORStateAdmin, checkDistrictSaveAccess, _SDTValidation.districtValidation, _others.formValidation, _DistrictController.default.save);
router.delete("/district/delete/:id", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdminORStateAdmin, CheckDistrictDeleteAccess, _DistrictController.default.delete);
router.get('/taluk/list', _jwtToken.jwtTokenPermission, checkTalukViewAccess, _TalukController.default.list);
router.get('/taluk/list/:isAll', _jwtToken.jwtTokenPermission, checkTalukViewAccess, _TalukController.default.list);
router.post("/taluk/save", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdminORStateAdminORDistrict, checkTalukSaveAccess, _SDTValidation.talukValidation, _others.formValidation, _TalukController.default.save);
router.delete("/taluk/delete/:id", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdminORStateAdminORDistrict, CheckTalukDeleteAccess, _TalukController.default.delete);

async function checkStateViewAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewState');
}

;

async function checkStateSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editState' : 'addState', true);
}

;

async function CheckStateDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteState');
}

;

async function checkDistrictViewAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewDistrict');
}

;

async function checkDistrictSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editDistrict' : 'addDistrict', true);
}

;

async function CheckDistrictDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteDistrict');
}

;

async function checkTalukViewAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewTaluk');
}

;

async function checkTalukSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editTaluk' : 'addTaluk', true);
}

;

async function CheckTalukDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteTaluk');
}

;
var _default = router;
exports.default = _default;