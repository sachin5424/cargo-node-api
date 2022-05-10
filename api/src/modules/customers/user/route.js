import { Router } from "express";
import UserController from "./UserConteroller";
import { customerResetPasswordValidation } from "../../../validation/CustomerValidations";
import { customerLoginValidation, cardValidation } from "../../../validation/CustomerValidations";
import {userRegister,userOtpVerification,userLoginWithMobile,userForgetPassword,chnagePassword,profileUpdate,profileDetails} from './userAuthController';
import {
    validationMiddleware,
    userRegisterValidation,
    otpVerified,
    userLoginMobileNumberValidation,
    userForgetPasswordValidation,
    chnagePasswordValidation,
    profileUpdateValidation
} from './userValidations'
const router = Router({ mergeParams: true });
import {jwtTokenPermission} from './jwt';
import {authenticateCustomer} from "./../../../middleware/jwtToken";
import {formValidation} from "./../../../middleware/others";


router.post("/login", customerLoginValidation, formValidation, UserController.login);
router.get("/email-verify/:email", UserController.verifyEmail);
router.post("/forget-pasword", UserController.genForgetPasswordUrl);
router.get("/reset-password/:key", UserController.resetPasswordForm);
router.post("/reset-password/:key", customerResetPasswordValidation, UserController.resetPAssword);
// router.post('/auth/user-register', userRegisterValidation,validationMiddleware,userRegister);
router.post('/auth/user-register', userRegisterValidation,validationMiddleware,userRegister);
router.post('/auth/user-otp-verify', otpVerified,validationMiddleware,userOtpVerification);
router.post('/auth/user-login-phone', userLoginMobileNumberValidation,validationMiddleware,userLoginWithMobile);
router.post('/auth/user-forget-password', userForgetPasswordValidation,validationMiddleware,userForgetPassword);
router.post('/auth/user-change-password',chnagePasswordValidation,validationMiddleware, chnagePassword);
router.post('/profile/update',authenticateCustomer, profileUpdateValidation,validationMiddleware,profileUpdate);
router.get('/profile/details',authenticateCustomer, profileDetails);

router.get('/card/details', authenticateCustomer, UserController.customerCardDetails);
router.post('/card/save', authenticateCustomer, cardValidation, formValidation, UserController.saveCustomerCardDetails);
router.delete('/card/delete', authenticateCustomer, UserController.deleteCustomerCardDetails);


//profileDetails
export default router;
