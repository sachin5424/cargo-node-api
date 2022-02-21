import { Router } from "express";
import UserController from "./UserConteroller";
import { customerLoginValidation } from "./_Validations";
import {vehicleOwnerValidate} from "../../../middleware/jwtToken";

const router = Router({ mergeParams: true });


router.post("/login", customerLoginValidation, UserController.login);
router.get("/test", vehicleOwnerValidate, (req, res)=> {res.send("success")});

// router.post('/refresh-token', userRefreshTokenValidation, UserController.refreshToken);
// router.post('/delete-refresh-token', userRefreshTokenValidation, UserController.tokenDelete);

export default router;
