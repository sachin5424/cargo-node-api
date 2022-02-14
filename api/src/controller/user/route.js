import { Router } from "express";
import UserController from "./UserConteroller";
import { userRegisterValidation, userLoginValidation, userRefreshTokenValidation, check_params } from "../../validation/user.validation";
import { jwtTokenPermission } from "../../middleware/jwtToken";
import { validateSuperAdmin, validateAnyOneAdmin } from "../../middleware/validateAdmin";
import { userValidation } from "./_Validations";

const router = Router({ mergeParams: true });


router.post("/resgister", userRegisterValidation, UserController.userRegister);
// router.get("/list",  UserController.userList);
router.get("/profile/:id", check_params, UserController.userProfile);
router.post("/login", userLoginValidation, UserController.userLogin);
router.post('/refresh-token', userRefreshTokenValidation, UserController.userRefreshToken);
router.post('/delete-refresh-token', userRefreshTokenValidation, UserController.userTokenDelete);

router.get('/list', jwtTokenPermission, validateSuperAdmin, UserController.list);

router.post("/save", jwtTokenPermission, validateSuperAdmin, userValidation, UserController.save );

export default router;
