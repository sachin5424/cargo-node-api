import { Router } from "express";
import UserController from "./UserConteroller";
import { userRegisterValidation, userLoginValidation, userRefreshTokenValidation, check_params } from "../../../validation/user.validation";
import { jwtTokenPermission } from "../../../middleware/jwtToken";
import { validateSuperAdmin, validateAnyOneAdmin } from "../../../middleware/validateAdmin";
import { userValidation } from "../../../validation/UserValidations";

const router = Router({ mergeParams: true });


router.post("/validate-token", jwtTokenPermission, (req, res)=>{res.send('ok')});
router.post("/resgister", userRegisterValidation, UserController.userRegister);
// router.get("/list",  UserController.userList);
router.get("/profile/:id", check_params, UserController.userProfile);
router.post("/login", userLoginValidation, UserController.userLogin);
router.post('/refresh-token', userRefreshTokenValidation, UserController.userRefreshToken);
router.post('/delete-refresh-token', userRefreshTokenValidation, UserController.userTokenDelete);

router.get('/list', jwtTokenPermission, validateSuperAdmin, UserController.list);
router.post("/save", jwtTokenPermission, (req, res, next)=>{validateAnyOneAdmin(req, res, next, 14)}, userValidation, UserController.save );
router.delete("/delete/:id", jwtTokenPermission, UserController.delete);


export default router;
