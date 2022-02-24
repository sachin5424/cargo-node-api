import { Router } from "express";
import UserController from "./UserConteroller";
import { vehicleOwnerLoginValidation } from "../../../validation/VehicleValidations";
import { vehicleOwnerResetPasswordValidation } from "../../../validation/VehicleValidations";

const router = Router({ mergeParams: true });


router.post("/login", vehicleOwnerLoginValidation, UserController.login);
router.get("/email-verify/:email", UserController.verifyEmail);
router.get("/forget-pasword/:email", UserController.genForgetPasswordUrl);
router.get("/reset-password/:key", UserController.resetPasswordForm);
router.post("/reset-password/:key", vehicleOwnerResetPasswordValidation, UserController.resetPAssword);



export default router;
