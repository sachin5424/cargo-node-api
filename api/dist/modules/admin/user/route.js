"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _UserConteroller = _interopRequireDefault(require("./UserConteroller"));

var _user = require("../../../validation/user.validation");

var _jwtToken = require("../../../middleware/jwtToken");

var _validateAdmin = require("../../../middleware/validateAdmin");

var _UserValidations = require("../../../validation/UserValidations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.post("/validate-token", _jwtToken.jwtTokenPermission, (req, res) => {
  res.send({
    type: global.cuser?.type
  });
});
router.post("/resgister", _user.userRegisterValidation, _UserConteroller.default.userRegister); // router.get("/list",  UserController.userList);

router.get("/profile/:id", _user.check_params, _UserConteroller.default.userProfile);
router.post("/login", _UserValidations.userLoginValidation, _UserConteroller.default.userLogin);
router.post('/refresh-token', _user.userRefreshTokenValidation, _UserConteroller.default.userRefreshToken);
router.post('/delete-refresh-token', _user.userRefreshTokenValidation, _UserConteroller.default.userTokenDelete);
router.get('/list', _jwtToken.jwtTokenPermission, checkUserViewAccess, _UserConteroller.default.list);
router.get('/list/:isAll', _jwtToken.jwtTokenPermission, checkUserViewAccess, _UserConteroller.default.list);
router.post("/save", _jwtToken.jwtTokenPermission, checkUserSaveAccess, _UserValidations.userValidation, _UserConteroller.default.save);
router.delete("/delete/:id", _jwtToken.jwtTokenPermission, CheckUserDeleteAccess, _UserConteroller.default.delete);

async function checkUserViewAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewUser');
}

;

async function checkUserSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editUser' : 'addUser', true);
}

;

async function CheckUserDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteUser');
}

;
var _default = router;
exports.default = _default;