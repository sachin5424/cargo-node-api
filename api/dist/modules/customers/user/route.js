"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _UserConteroller = _interopRequireDefault(require("./UserConteroller"));

var _CustomerValidations = require("../../../validation/CustomerValidations");

var _userAuthController = require("./userAuthController");

var _userValidations = require("./userValidations");

var _jwt = require("./jwt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.post("/login", _CustomerValidations.customerLoginValidation, _UserConteroller.default.login);
router.get("/email-verify/:email", _UserConteroller.default.verifyEmail);
router.post("/forget-pasword", _UserConteroller.default.genForgetPasswordUrl);
router.get("/reset-password/:key", _UserConteroller.default.resetPasswordForm);
router.post("/reset-password/:key", _CustomerValidations.customerResetPasswordValidation, _UserConteroller.default.resetPAssword); // router.post('/auth/user-register', userRegisterValidation,validationMiddleware,userRegister);

router.post('/auth/user-register', _userValidations.userRegisterValidation, _userValidations.validationMiddleware, _userAuthController.userRegister);
router.post('/auth/user-otp-verify', _userValidations.otpVerified, _userValidations.validationMiddleware, _userAuthController.userOtpVerification);
router.post('/auth/user-login-phone', _userValidations.userLoginMobileNumberValidation, _userValidations.validationMiddleware, _userAuthController.userLoginWithMobile);
router.post('/auth/user-forget-password', _userValidations.userForgetPasswordValidation, _userValidations.validationMiddleware, _userAuthController.userForgetPassword);
router.post('/auth/user-change-password', _userValidations.chnagePasswordValidation, _userValidations.validationMiddleware, _userAuthController.chnagePassword);
router.post('/profile/update', _jwt.jwtTokenPermission, _userValidations.profileUpdateValidation, _userValidations.validationMiddleware, _userAuthController.profileUpdate);
router.get('/profile/details', _jwt.jwtTokenPermission, _userAuthController.profileDetails); //profileDetails

var _default = router;
exports.default = _default;