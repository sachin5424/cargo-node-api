import { Router } from "express";
import UserController from "./UserConteroller";
import { customerResetPasswordValidation } from "../../../validation/CustomerValidations";
import { customerLoginValidation } from "../../../validation/CustomerValidations";
const router = Router({ mergeParams: true });


router.post("/login", customerLoginValidation, UserController.login);
router.get("/email-verify/:email", UserController.verifyEmail);
router.get("/forget-pasword/:email", UserController.genForgetPasswordUrl);
router.get("/reset-password/:key", UserController.resetPasswordForm);
router.post("/reset-password/:key", customerResetPasswordValidation, UserController.resetPAssword);



export default router;
