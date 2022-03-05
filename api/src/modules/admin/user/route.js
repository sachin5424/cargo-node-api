import { Router } from "express";
import UserController from "./UserConteroller";
import { userRegisterValidation, userRefreshTokenValidation, check_params } from "../../../validation/user.validation";
import { jwtTokenPermission } from "../../../middleware/jwtToken";
import { validateSuperAdmin, validateAnyOneAdmin, checkAdminPermission} from "../../../middleware/validateAdmin";
import { userValidation, userLoginValidation } from "../../../validation/UserValidations";

const router = Router({ mergeParams: true });


router.post("/validate-token", jwtTokenPermission, (req, res)=>{res.send('ok')});
router.post("/resgister", userRegisterValidation, UserController.userRegister);
// router.get("/list",  UserController.userList);
router.get("/profile/:id", check_params, UserController.userProfile);
router.post("/login", userLoginValidation, UserController.userLogin);
router.post('/refresh-token', userRefreshTokenValidation, UserController.userRefreshToken);
router.post('/delete-refresh-token', userRefreshTokenValidation, UserController.userTokenDelete);

router.get('/list', jwtTokenPermission, checkUserViewAccess, UserController.list);
router.get('/list/:isAll', jwtTokenPermission, checkUserViewAccess, UserController.list);
router.post("/save", jwtTokenPermission, checkUserSaveAccess, userValidation, UserController.save );
router.delete("/delete/:id", jwtTokenPermission, CheckUserDeleteAccess, UserController.delete);

async function checkUserViewAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewUser'); };
async function checkUserSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editUser' : 'addUser', true); };
async function CheckUserDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteUser'); };


export default router;
