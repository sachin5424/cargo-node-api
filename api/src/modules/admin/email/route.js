import { Router } from "express";
import TemplateController from "./TemplateController";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { formValidation } from "../../../middleware/others";
import { templateValidation } from "../../../validation/EmailValidations";

const router = Router({ mergeParams: true });

router.get('/template/list', checkEmailTemplateListAccess, TemplateController.list);
router.get('/template/list/:isAll', checkEmailTemplateListAccess, TemplateController.list);
router.post('/template/save', checkEmailTemplateSaveAccess, templateValidation, formValidation, TemplateController.save);
router.delete("/template/delete/:id", CheckEmailTemplateDeleteAccess, TemplateController.delete);


async function checkEmailTemplateListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewEmailTemplate'); };
async function checkEmailTemplateSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editEmailTemplate' : 'addEmailTemplate'); };
async function CheckEmailTemplateDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteEmailTemplate'); };


export default router;