import { Router } from "express";
import UserController from "./UserConteroller";
import { customerLoginValidation } from "../../../validation/CustomerValidations";
import {vehicleOwnerValidate} from "../../../middleware/jwtToken";
import { vehicleOwnerResetPasswordValidation } from "../../../validation/VehicleValidations";

const router = Router({ mergeParams: true });


router.post("/login", customerLoginValidation, UserController.login);
router.get("/email-verify/:email", UserController.verifyEmail);
router.get("/forget-pasword/:email", UserController.genForgetPasswordUrl);
router.get("/reset-password/:key", UserController.resetPasswordForm);
router.post("/reset-password/:key", vehicleOwnerResetPasswordValidation, UserController.resetPAssword);



export default router;
