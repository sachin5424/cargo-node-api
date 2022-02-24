import { Router } from "express";
import UserController from "./UserConteroller";
import { driverResetPasswordValidation } from "../../../validation/DriverValidations";
import { driverLoginValidation } from "../../../validation/DriverValidations";

const router = Router({ mergeParams: true });


router.post("/login", driverLoginValidation, UserController.login);
router.get("/email-verify/:email", UserController.verifyEmail);
router.get("/forget-pasword/:email", UserController.genForgetPasswordUrl);
router.get("/reset-password/:key", UserController.resetPasswordForm);
router.post("/reset-password/:key", driverResetPasswordValidation, UserController.resetPAssword);


export default router;
