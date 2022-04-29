"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _NotificationController = _interopRequireDefault(require("./NotificationController"));

var _validateAdmin = require("../../../middleware/validateAdmin");

var _others = require("../../../middleware/others");

var _NotificationValidations = require("../../../validation/NotificationValidations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/list', checkNotificationListAccess, _NotificationController.default.list);
router.get('/list/:isAll', checkNotificationListAccess, _NotificationController.default.list);
router.post('/save', checkNotificationSaveAccess, _NotificationValidations.notificationValidation, _others.formValidation, _NotificationController.default.save);
router.delete("/delete/:id", CheckNotificationDeleteAccess, _NotificationController.default.delete);

async function checkNotificationListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewNotification');
}

;

async function checkNotificationSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editNotification' : 'addNotification');
}

;

async function CheckNotificationDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteNotification');
}

;
var _default = router;
exports.default = _default;