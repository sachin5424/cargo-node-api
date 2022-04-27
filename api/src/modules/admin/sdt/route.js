import { Router } from "express";
import { jwtTokenPermission } from "../../../middleware/jwtToken";
import SDTController from "./SDTController";
import StateController from "./StateController";
import DistrictController from "./DistrictController";
import TalukController from "./TalukController";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { stateValidation, districtValidation, talukValidation } from "../../../validation/SDTValidation";
import { formValidation } from "../../../middleware/others";
import { validateSuperAdmin, validateSuperAdminORStateAdmin, validateSuperAdminORStateAdminORDistrict } from "../../../middleware/validateAdmin";

const router = Router({ mergeParams: true });

router.get('/sdt', jwtTokenPermission, SDTController.sdtList);

router.get('/state/list', jwtTokenPermission, checkStateViewAccess, StateController.list);
router.get('/state/list/:isAll', jwtTokenPermission, checkStateViewAccess, StateController.list);
router.post("/state/save", jwtTokenPermission, validateSuperAdmin, checkStateSaveAccess, stateValidation, formValidation, StateController.save );
router.delete("/state/delete/:id", jwtTokenPermission, validateSuperAdmin, CheckStateDeleteAccess, StateController.delete);

router.get('/district/list', jwtTokenPermission, checkDistrictViewAccess, DistrictController.list);
router.get('/district/list/:isAll', jwtTokenPermission, checkDistrictViewAccess, DistrictController.list);
router.post("/district/save", jwtTokenPermission, validateSuperAdminORStateAdmin, checkDistrictSaveAccess, districtValidation, formValidation, DistrictController.save );
router.delete("/district/delete/:id", jwtTokenPermission, validateSuperAdminORStateAdmin, CheckDistrictDeleteAccess, DistrictController.delete);

router.get('/taluk/list', jwtTokenPermission, checkTalukViewAccess, TalukController.list);
router.get('/taluk/list/:isAll', jwtTokenPermission, checkTalukViewAccess, TalukController.list);
router.post("/taluk/save", jwtTokenPermission, validateSuperAdminORStateAdminORDistrict, checkTalukSaveAccess, talukValidation, formValidation, TalukController.save );
router.delete("/taluk/delete/:id", jwtTokenPermission, validateSuperAdminORStateAdminORDistrict, CheckTalukDeleteAccess, TalukController.delete);

async function checkStateViewAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewState'); };
async function checkStateSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editState' : 'addState', true); };
async function CheckStateDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteState'); };

async function checkDistrictViewAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewDistrict'); };
async function checkDistrictSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editDistrict' : 'addDistrict', true); };
async function CheckDistrictDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteDistrict'); };

async function checkTalukViewAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewTaluk'); };
async function checkTalukSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editTaluk' : 'addTaluk', true); };
async function CheckTalukDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteTaluk'); };

export default router;
