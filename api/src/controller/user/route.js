import { Router } from "express";
import UserController from "./UserConteroller";
import { userRegisterValidation, userLoginValidation, userRefreshTokenValidation, check_params } from "../../validation/user.validation";

const router = Router({ mergeParams: true });


router.post("/resgister", userRegisterValidation, UserController.userRegister);
router.get("/list",  UserController.userList);
router.get("/profile/:id", check_params, UserController.userProfile);
router.post("/login", userLoginValidation, UserController.userLogin);
router.post('/refresh-token', userRefreshTokenValidation, UserController.userRefreshToken);
router.post('/delete-refresh-token', userRefreshTokenValidation, UserController.userTokenDelete);

export default router;
