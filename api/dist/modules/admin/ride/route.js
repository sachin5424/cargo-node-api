"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _TypeConteroller = _interopRequireDefault(require("./TypeConteroller"));

var _validateAdmin = require("../../../middleware/validateAdmin");

var _RideValidations = require("../../../validation/RideValidations");

var _others = require("../../../middleware/others");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/type/list', checkRideTypeListAccess, _TypeConteroller.default.list);
router.get('/type/list/:isAll', checkRideTypeListAccess, _TypeConteroller.default.list);
router.post('/type/save', checkRideTypeSaveAccess, _RideValidations.rideTypeValidation, _others.formValidation, _TypeConteroller.default.save);
router.delete("/type/delete/:id", CheckRideTypeDeleteAccess, _TypeConteroller.default.delete);

async function checkRideTypeListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewRideType');
}

;

async function checkRideTypeSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editRideType' : 'addRideType', true);
}

;

async function CheckRideTypeDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteRideType');
}

;
var _default = router;
exports.default = _default;