import { Router } from "express";
import { validateAnyOneAdmin } from "../../../middleware/validateAdmin";
import DriverController from "./DriverController";
import { driverValidation } from "../../../validation/DriverValidations";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { formValidation } from "../../../middleware/others";

const router = Router({ mergeParams: true });

router.get('/list', checkDriverListAccess, DriverController.list);
router.get('/list/:isAll', checkDriverListAccess, DriverController.list);
router.post('/save', checkDriverSaveAccess, driverValidation, formValidation, DriverController.save);
router.delete("/delete/:id", CheckDriverDeleteAccess, DriverController.delete);


async function checkDriverListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewDriver'); };
async function checkDriverSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editDriver' : 'addDriver', true); };
async function CheckDriverDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteDriver'); };

export default router;
