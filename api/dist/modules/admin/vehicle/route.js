"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _CategoryConteroller = _interopRequireDefault(require("./CategoryConteroller"));

var _VehicleController = _interopRequireDefault(require("./VehicleController"));

var _MakeController = _interopRequireDefault(require("./MakeController"));

var _ColorController = _interopRequireDefault(require("./ColorController"));

var _MakeModelController = _interopRequireDefault(require("./MakeModelController"));

var _VehicleValidations = require("../../../validation/VehicleValidations");

var _import = require("../../../settings/import");

var _validateAdmin = require("../../../middleware/validateAdmin");

var _others = require("../../../middleware/others");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/color/list', _import.jwtTokenPermission, checkColorListAccess, _ColorController.default.list);
router.get('/color/list/:isAll', _import.jwtTokenPermission, checkColorListAccess, _ColorController.default.list);
router.post('/color/save', _import.jwtTokenPermission, checkColorSaveAccess, _VehicleValidations.ColorValidation, _others.formValidation, _ColorController.default.save);
router.delete("/color/delete/:id", _import.jwtTokenPermission, CheckColorDeleteAccess, _ColorController.default.delete);
router.get('/make/list', _import.jwtTokenPermission, checkMakeListAccess, _MakeController.default.list);
router.get('/make/list/:isAll', _import.jwtTokenPermission, checkMakeListAccess, _MakeController.default.list);
router.post('/make/save', _import.jwtTokenPermission, checkMakeSaveAccess, _VehicleValidations.MakeValidation, _others.formValidation, _MakeController.default.save);
router.delete("/make/delete/:id", _import.jwtTokenPermission, CheckMakeDeleteAccess, _MakeController.default.delete);
router.get('/make-model/list', _import.jwtTokenPermission, checkMakeModelListAccess, _MakeModelController.default.list);
router.get('/make-model/list/:isAll', _import.jwtTokenPermission, checkMakeModelListAccess, _MakeModelController.default.list);
router.post('/make-model/save', _import.jwtTokenPermission, checkMakeModelSaveAccess, _VehicleValidations.MakeModelValidation, _others.formValidation, _MakeModelController.default.save);
router.delete("/make-model/delete/:id", _import.jwtTokenPermission, CheckMakeModelDeleteAccess, _MakeModelController.default.delete);
router.get('/category/list', _import.jwtTokenPermission, checkVehicleCategoryListAccess, _CategoryConteroller.default.list);
router.get('/category/list/:isAll', _import.jwtTokenPermission, checkVehicleCategoryListAccess, _CategoryConteroller.default.list);
router.post('/category/save', _import.jwtTokenPermission, checkVehicleCategorySaveAccess, _VehicleValidations.vehicleCategoryValidation, _others.formValidation, _CategoryConteroller.default.save);
router.delete("/category/delete/:id", _import.jwtTokenPermission, CheckVehicleCategoryDeleteAccess, _CategoryConteroller.default.delete);
router.get('/list', _import.jwtTokenPermission, checkVehicleListAccess, _VehicleController.default.list);
router.get('/list/:isAll', _import.jwtTokenPermission, checkVehicleListAccess, _VehicleController.default.list);
router.post('/save', _import.jwtTokenPermission, checkVehicleSaveAccess, _VehicleValidations.vehicleValidation, _others.formValidation, _VehicleController.default.save);
router.delete("/delete/:id", _import.jwtTokenPermission, CheckVehicleDeleteAccess, _VehicleController.default.delete);

async function checkColorListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewColor');
}

;

async function checkColorSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editColor' : 'addColor', true);
}

;

async function CheckColorDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteColor');
}

;

async function checkMakeListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewMake');
}

;

async function checkMakeSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editMake' : 'addMake', true);
}

;

async function CheckMakeDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteMake');
}

;

async function checkMakeModelListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewMakeModel');
}

;

async function checkMakeModelSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editMakeModel' : 'addMakeModel', true);
}

;

async function CheckMakeModelDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteMakeModel');
}

;

async function checkVehicleCategoryListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewVehicleCategory');
}

;

async function checkVehicleCategorySaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editVehicleCategory' : 'addVehicleCategory', true);
}

;

async function CheckVehicleCategoryDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteVehicleCategory');
}

;

async function checkVehicleListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewVehicle');
}

;

async function checkVehicleSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editVehicle' : 'addVehicle', true);
}

;

async function CheckVehicleDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteVehicle');
}

;
var _default = router;
exports.default = _default;