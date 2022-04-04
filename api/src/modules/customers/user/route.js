import { Router } from "express";
import UserController from "./UserConteroller";
import { customerResetPasswordValidation } from "../../../validation/CustomerValidations";
import { customerLoginValidation } from "../../../validation/CustomerValidations";
import {userRegister,userOtpVerification,userLoginWithMobile,userForgetPassword} from './userAuthController';
import {validationMiddleware,userRegisterValidation,otpVerified,userLoginMobileNumberValidation,userForgetPasswordValidation} from './userValidations'
const router = Router({ mergeParams: true });


router.post("/login", customerLoginValidation, UserController.login);
router.get("/email-verify/:email", UserController.verifyEmail);
router.get("/forget-pasword/:email", UserController.genForgetPasswordUrl);
router.get("/reset-password/:key", UserController.resetPasswordForm);
router.post("/reset-password/:key", customerResetPasswordValidation, UserController.resetPAssword);
// router.post('/auth/user-register', userRegisterValidation,validationMiddleware,userRegister);
router.post('/auth/user-register', userRegisterValidation,validationMiddleware,userRegister);
router.post('/auth/user-otp-verify', otpVerified,validationMiddleware,userOtpVerification);
router.post('/auth/user-login-phone', userLoginMobileNumberValidation,validationMiddleware,userLoginWithMobile);
router.post('/auth/user-forget-password', userForgetPasswordValidation,validationMiddleware,userForgetPassword);
export default router;
