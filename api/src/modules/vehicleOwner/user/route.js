import { Router } from "express";
import UserController from "./UserConteroller";
import { customerLoginValidation } from "../../../validation/CustomerValidations";
import {vehicleOwnerValidate} from "../../../middleware/jwtToken";

const router = Router({ mergeParams: true });


router.post("/login", customerLoginValidation, UserController.login);
router.get("/email-verify/:email", UserController.verifyEmail);
router.get("/test", vehicleOwnerValidate, (req, res)=> {res.send("success")});


export default router;
