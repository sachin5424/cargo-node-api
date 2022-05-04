import { Router } from "express";
import FareManagementConteroller from "./FareManagementConteroller";
import PackageConteroller from "./PackageConteroller";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { packageValidations, fareManagementValidations } from "../../../validation/FareValidations";
import { formValidation } from "../../../middleware/others";

const router = Router({ mergeParams: true });

router.get('/package/list', /* checkPackageListAccess, */ PackageConteroller.list);
router.get('/package/list/:isAll', /* checkPackageListAccess, */ PackageConteroller.list);
router.post('/package/save',  checkPackageSaveAccess, packageValidations, formValidation, PackageConteroller.save);
router.delete("/package/delete/:id", checkPackageDeleteAccess,  PackageConteroller.delete);

router.get('/list', checkFareManagementListAccess, FareManagementConteroller.list);
router.get('/list/:isAll', checkFareManagementListAccess, FareManagementConteroller.list);
router.post('/save',  checkFareManagementSaveAccess, fareManagementValidations, formValidation, FareManagementConteroller.save);
router.delete("/delete/:id", checkFareManagementDeleteAccess,  FareManagementConteroller.delete);

async function checkPackageListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewPackage'); };
async function checkPackageSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editPackage' : 'addPackage'); };
async function checkPackageDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deletePackage'); };

async function checkFareManagementListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewFareManagement'); };
async function checkFareManagementSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editFareManagement' : 'addFareManagement', true); };
async function checkFareManagementDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteFareManagement'); };


export default router;