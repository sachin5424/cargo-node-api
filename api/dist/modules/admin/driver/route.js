"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _DriverController = _interopRequireDefault(require("./DriverController"));

var _WalletController = _interopRequireDefault(require("./WalletController"));

var _DriverValidations = require("../../../validation/DriverValidations");

var _validateAdmin = require("../../../middleware/validateAdmin");

var _others = require("../../../middleware/others");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/list/wallet-history', checkWalletListAccess, _WalletController.default.list);
router.get('/list/wallet-history/:isAll', checkWalletListAccess, _WalletController.default.list);
router.post('/save/wallet-history', checkWalletSaveAccess, _DriverValidations.walletValidationAdmin, _others.formValidation, _WalletController.default.save);
router.get('/list', checkDriverListAccess, _DriverController.default.list);
router.get('/list/:isAll', checkDriverListAccess, _DriverController.default.list);
router.post('/save', checkDriverSaveAccess, _DriverValidations.driverValidation, _others.formValidation, _DriverController.default.save);
router.delete("/delete/:id", CheckDriverDeleteAccess, _DriverController.default.delete);

async function checkWalletListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewWallet');
}

;

async function checkWalletSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'addWallet');
}

;

async function checkDriverListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewDriver');
}

;

async function checkDriverSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editDriver' : 'addDriver', true);
}

;

async function CheckDriverDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteDriver');
}

;
var _default = router;
exports.default = _default;