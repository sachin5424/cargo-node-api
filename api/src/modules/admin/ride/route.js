import { Router } from "express";
import TypeConteroller from "./TypeConteroller";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { rideTypeValidation } from "../../../validation/RideValidations";
import { formValidation } from "../../../middleware/others";

const router = Router({ mergeParams: true });

router.get('/type/list', checkRideTypeListAccess, TypeConteroller.list);
router.get('/type/list/:isAll', checkRideTypeListAccess, TypeConteroller.list);
router.post('/type/save',  checkRideTypeSaveAccess, rideTypeValidation, formValidation, TypeConteroller.save);
router.delete("/type/delete/:id", CheckRideTypeDeleteAccess,  TypeConteroller.delete);

async function checkRideTypeListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewRideType'); };
async function checkRideTypeSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editRideType' : 'addRideType', true); };
async function CheckRideTypeDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteRideType'); };


export default router;
