import { Router } from "express";
import TemplateController from "./TemplateController";
import EmailController from "./EmailController";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { formValidation } from "../../../middleware/others";
import { templateValidation, sendEmailValidation } from "../../../validation/EmailValidations";

const router = Router({ mergeParams: true });

router.get('/template/list', checkEmailTemplateListAccess, TemplateController.list);
router.get('/template/list/:isAll', checkEmailTemplateListAccess, TemplateController.list);
router.post('/template/save', checkEmailTemplateSaveAccess, templateValidation, formValidation, TemplateController.save);
router.delete("/template/delete/:id", CheckEmailTemplateDeleteAccess, TemplateController.delete);

// router.get('/list', checkSentEmailListAccess, EmailController.list);
// router.get('/list/:isAll', checkSentEmailListAccess, EmailController.list);
router.post('/save', checkSendEmailAccess, sendEmailValidation, formValidation, EmailController.save);
// router.delete("/delete/:id", EmailController.delete);


async function checkEmailTemplateListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewEmailTemplate'); };
async function checkEmailTemplateSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editEmailTemplate' : 'addEmailTemplate'); };
async function CheckEmailTemplateDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteEmailTemplate'); };

async function checkSentEmailListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewSentEmail'); };
async function checkSendEmailAccess (req, res, next) { checkAdminPermission(req, res, next, 'sendEmail'); };

export default router;