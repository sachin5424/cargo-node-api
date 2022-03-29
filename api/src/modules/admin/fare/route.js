import { Router } from "express";
import FareManagementConteroller from "./FareManagementConteroller";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { fareManagementValidations } from "../../../validation/FareValidations";
import { formValidation } from "../../../middleware/others";

const router = Router({ mergeParams: true });

router.get('/list', checkFareManagementListAccess, FareManagementConteroller.list);
router.get('/list/:isAll', checkFareManagementListAccess, FareManagementConteroller.list);
router.post('/save',  checkFareManagementSaveAccess, fareManagementValidations, formValidation, FareManagementConteroller.save);
router.delete("/delete/:id", checkFareManagementDeleteAccess,  FareManagementConteroller.delete);

async function checkFareManagementListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewFareManagement'); };
async function checkFareManagementSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editFareManagement' : 'addFareManagement', true); };
async function checkFareManagementDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteFareManagement'); };


export default router;
