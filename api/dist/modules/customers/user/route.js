"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _UserConteroller = _interopRequireDefault(require("./UserConteroller"));

var _CustomerValidations = require("../../../validation/CustomerValidations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.post("/login", _CustomerValidations.customerLoginValidation, _UserConteroller.default.login);
router.get("/email-verify/:email", _UserConteroller.default.verifyEmail);
router.get("/forget-pasword/:email", _UserConteroller.default.genForgetPasswordUrl);
router.get("/reset-password/:key", _UserConteroller.default.resetPasswordForm);
router.post("/reset-password/:key", _CustomerValidations.customerResetPasswordValidation, _UserConteroller.default.resetPAssword);
var _default = router;
exports.default = _default;