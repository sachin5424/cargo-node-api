import { Router } from "express";
import NotificationController from "./NotificationController";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { formValidation } from "../../../middleware/others";
import { templateValidation } from "../../../validation/EmailValidations";

const router = Router({ mergeParams: true });

router.get('/list', checkNotificationListAccess, NotificationController.list);
router.get('/list/:isAll', checkNotificationListAccess, NotificationController.list);
router.post('/save', checkNotificationSaveAccess, /* templateValidation, formValidation, */ NotificationController.save);
router.delete("/delete/:id", CheckNotificationDeleteAccess, NotificationController.delete);

async function checkNotificationListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewEmailTemplate'); };
async function checkNotificationSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editEmailTemplate' : 'addEmailTemplate'); };
async function CheckNotificationDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteEmailTemplate'); };

export default router;