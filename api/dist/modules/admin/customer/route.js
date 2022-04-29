"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _validateAdmin = require("../../../middleware/validateAdmin");

var _CustomerController = _interopRequireDefault(require("./CustomerController"));

var _LocationController = _interopRequireDefault(require("./LocationController"));

var _CustomerValidations = require("../../../validation/CustomerValidations");

var _jwtToken = require("../../../middleware/jwtToken");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/list', _jwtToken.jwtTokenPermission, checkCustomerListAccess, _CustomerController.default.list);
router.get('/list/:isAll', _jwtToken.jwtTokenPermission, checkCustomerListAccess, _CustomerController.default.list);
router.post('/save', _jwtToken.jwtTokenPermission, checkCustomerSaveAccess, _CustomerValidations.customerValidation, _CustomerController.default.save);
router.delete("/delete/:id", _jwtToken.jwtTokenPermission, CheckCustomerDeleteAccess, _CustomerController.default.delete);
router.get('/location/list', _jwtToken.jwtTokenPermission, checkCustomerListAccess, _CustomerValidations.locationSearch, _LocationController.default.list);
router.post('/location/save', _jwtToken.jwtTokenPermission, checkCustomerSaveAccess, _CustomerValidations.locationValidation, _LocationController.default.save);
router.delete("/location/delete/:id", _jwtToken.jwtTokenPermission, CheckCustomerDeleteAccess, _LocationController.default.delete);
var _default = router;
exports.default = _default;

async function checkCustomerListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewCustomer');
}

;

async function checkCustomerSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editCustomer' : 'addCustomer', true);
}

;

async function CheckCustomerDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteCustomer');
}

;