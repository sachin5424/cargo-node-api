import { Router } from "express";
import CategoryConteroller from "./CategoryConteroller";
import VehicleController from "./VehicleController";
import MakeController from "./MakeController";
import ColorController from "./ColorController";
import MakeModelController from "./MakeModelController";
import { vehicleValidation, vehicleCategoryValidation, MakeValidation, MakeModelValidation, ColorValidation} from "../../../validation/VehicleValidations";
import { jwtTokenPermission } from "../../../settings/import";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { formValidation } from "../../../middleware/others";

const router = Router({ mergeParams: true });

router.get('/color/list', jwtTokenPermission, checkColorListAccess, ColorController.list);
router.get('/color/list/:isAll', jwtTokenPermission, checkColorListAccess, ColorController.list);
router.post('/color/save', jwtTokenPermission, checkColorSaveAccess, ColorValidation, formValidation, ColorController.save);
router.delete("/color/delete/:id", jwtTokenPermission, CheckColorDeleteAccess, ColorController.delete);

router.get('/make/list', jwtTokenPermission, checkMakeListAccess, MakeController.list);
router.get('/make/list/:isAll', jwtTokenPermission, checkMakeListAccess, MakeController.list);
router.post('/make/save', jwtTokenPermission, checkMakeSaveAccess, MakeValidation, formValidation, MakeController.save);
router.delete("/make/delete/:id", jwtTokenPermission, CheckMakeDeleteAccess, MakeController.delete);

router.get('/make-model/list', jwtTokenPermission, checkMakeModelListAccess, MakeModelController.list);
router.get('/make-model/list/:isAll', jwtTokenPermission, checkMakeModelListAccess, MakeModelController.list);
router.post('/make-model/save', jwtTokenPermission, checkMakeModelSaveAccess, MakeModelValidation, formValidation, MakeModelController.save);
router.delete("/make-model/delete/:id", jwtTokenPermission, CheckMakeModelDeleteAccess, MakeModelController.delete);

router.get('/category/list', jwtTokenPermission, checkVehicleCategoryListAccess, CategoryConteroller.list);
router.get('/category/list/:isAll', jwtTokenPermission, checkVehicleCategoryListAccess, CategoryConteroller.list);
router.post('/category/save', jwtTokenPermission, checkVehicleCategorySaveAccess, vehicleCategoryValidation, formValidation, CategoryConteroller.save);
router.delete("/category/delete/:id", jwtTokenPermission, CheckVehicleCategoryDeleteAccess, CategoryConteroller.delete);

router.get('/list', jwtTokenPermission, checkVehicleListAccess, VehicleController.list);
router.get('/list/:isAll', jwtTokenPermission, checkVehicleListAccess, VehicleController.list);
router.post('/save', jwtTokenPermission, checkVehicleSaveAccess,  vehicleValidation, formValidation, VehicleController.save);
router.delete("/delete/:id", jwtTokenPermission, CheckVehicleDeleteAccess, VehicleController.delete);


async function checkColorListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewColor'); };
async function checkColorSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editColor' : 'addColor', true); };
async function CheckColorDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteColor'); };

async function checkMakeListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewMake'); };
async function checkMakeSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editMake' : 'addMake', true); };
async function CheckMakeDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteMake'); };

async function checkMakeModelListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewMakeModel'); };
async function checkMakeModelSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editMakeModel' : 'addMakeModel', true); };
async function CheckMakeModelDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteMakeModel'); };

async function checkVehicleCategoryListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewVehicleCategory'); };
async function checkVehicleCategorySaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editVehicleCategory' : 'addVehicleCategory', true); };
async function CheckVehicleCategoryDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteVehicleCategory'); };

async function checkVehicleListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewVehicle'); };
async function checkVehicleSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editVehicle' : 'addVehicle', true); };
async function CheckVehicleDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteVehicle'); };

export default router;
