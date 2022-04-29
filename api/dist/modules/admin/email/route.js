"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _TemplateController = _interopRequireDefault(require("./TemplateController"));

var _EmailController = _interopRequireDefault(require("./EmailController"));

var _validateAdmin = require("../../../middleware/validateAdmin");

var _others = require("../../../middleware/others");

var _EmailValidations = require("../../../validation/EmailValidations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/template/list', checkEmailTemplateListAccess, _TemplateController.default.list);
router.get('/template/list/:isAll', checkEmailTemplateListAccess, _TemplateController.default.list);
router.post('/template/save', checkEmailTemplateSaveAccess, _EmailValidations.templateValidation, _others.formValidation, _TemplateController.default.save);
router.delete("/template/delete/:id", CheckEmailTemplateDeleteAccess, _TemplateController.default.delete); // router.get('/list', checkSentEmailListAccess, EmailController.list);
// router.get('/list/:isAll', checkSentEmailListAccess, EmailController.list);

router.post('/save', checkSendEmailAccess, _EmailValidations.sendEmailValidation, _others.formValidation, _EmailController.default.save); // router.delete("/delete/:id", EmailController.delete);

async function checkEmailTemplateListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewEmailTemplate');
}

;

async function checkEmailTemplateSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editEmailTemplate' : 'addEmailTemplate');
}

;

async function CheckEmailTemplateDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteEmailTemplate');
}

;

async function checkSentEmailListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewSentEmail');
}

;

async function checkSendEmailAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'sendEmail');
}

;
var _default = router;
exports.default = _default;