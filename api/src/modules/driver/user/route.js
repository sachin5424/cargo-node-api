import { Router } from "express";
import UserController from "./UserConteroller";
import { driverResetPasswordValidation } from "../../../validation/DriverValidations";

const router = Router({ mergeParams: true });


router.get("/email-verify/:email", UserController.verifyEmail);
router.get("/forget-pasword/:email", UserController.genForgetPasswordUrl);
router.post("/reset-password/:key", driverResetPasswordValidation, UserController.resetPAssword);


export default router;
