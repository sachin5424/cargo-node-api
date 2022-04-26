import { Router } from "express";
import { jwtTokenPermission } from "../../../middleware/jwtToken";
import SDTController from "./SDTController";
import StateController from "./StateController";
import DistrictController from "./DistrictController";
import TalukController from "./TalukController";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { stateValidation, districtValidation, talukValidation } from "../../../validation/SDTValidation";
import { formValidation } from "../../../middleware/others";

const router = Router({ mergeParams: true });

router.get('/sdt', jwtTokenPermission, SDTController.sdtList);

router.get('/state/list', jwtTokenPermission, checkSDTViewAccess, StateController.list);
router.get('/state/list/:isAll', jwtTokenPermission, checkSDTViewAccess, StateController.list);
router.post("/state/save", jwtTokenPermission, checkSDTSaveAccess, stateValidation, formValidation, StateController.save );
router.delete("/state/delete/:id", jwtTokenPermission, CheckSDTDeleteAccess, StateController.delete);

router.get('/district/list', jwtTokenPermission, checkSDTViewAccess, DistrictController.list);
router.get('/district/list/:isAll', jwtTokenPermission, checkSDTViewAccess, DistrictController.list);
router.post("/district/save", jwtTokenPermission, checkSDTSaveAccess, districtValidation, formValidation, DistrictController.save );
router.delete("/district/delete/:id", jwtTokenPermission, CheckSDTDeleteAccess, DistrictController.delete);

router.get('/taluk/list', jwtTokenPermission, checkSDTViewAccess, TalukController.list);
router.get('/taluk/list/:isAll', jwtTokenPermission, checkSDTViewAccess, TalukController.list);
router.post("/taluk/save", jwtTokenPermission, checkSDTSaveAccess, talukValidation, formValidation, TalukController.save );
router.delete("/taluk/delete/:id", jwtTokenPermission, CheckSDTDeleteAccess, TalukController.delete);

async function checkSDTViewAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewSDT'); };
async function checkSDTSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editSDT' : 'addSDT', true); };
async function CheckSDTDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteSDT'); };

export default router;
