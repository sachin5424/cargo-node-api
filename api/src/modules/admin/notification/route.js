import { Router } from "express";
import NotificationController from "./NotificationController";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { formValidation } from "../../../middleware/others";
import { notificationValidation } from "../../../validation/NotificationValidations";

const router = Router({ mergeParams: true });

router.get('/list', checkNotificationListAccess, NotificationController.list);
router.get('/list/:isAll', checkNotificationListAccess, NotificationController.list);
router.post('/save', checkNotificationSaveAccess, notificationValidation, formValidation, NotificationController.save);
router.delete("/delete/:id", CheckNotificationDeleteAccess, NotificationController.delete);

async function checkNotificationListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewNotification'); };
async function checkNotificationSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editNotification' : 'addNotification'); };
async function CheckNotificationDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteNotification'); };

export default router;