import { Router } from "express";
import UserController from "./UserConteroller";
import { customerResetPasswordValidation } from "../../../validation/CustomerValidations";

const router = Router({ mergeParams: true });


router.get("/email-verify/:email", UserController.verifyEmail);
router.get("/forget-pasword/:email", UserController.genForgetPasswordUrl);
router.post("/reset-password/:key", customerResetPasswordValidation, UserController.resetPAssword);



export default router;
