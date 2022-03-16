import { Router } from "express";
import CategoryConteroller from "./CategoryConteroller";
import VehicleController from "./VehicleController";
import MakeController from "./MakeController";
import MakeModelController from "./MakeModelController";
import { vehicleValidation, vehicleCategoryValidation, MakeValidation, MakeModelValidation} from "../../../validation/VehicleValidations";
import { jwtTokenPermission } from "../../../settings/import";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { formValidation } from "../../../middleware/others";

const router = Router({ mergeParams: true });

router.get('/make/list', jwtTokenPermission, checkVehicleCategoryListAccess, MakeController.list);
router.get('/make/list/:isAll', jwtTokenPermission, checkVehicleCategoryListAccess, MakeController.list);
router.post('/make/save', jwtTokenPermission, checkVehicleCategorySaveAccess, MakeValidation, formValidation, MakeController.save);
router.delete("/make/delete/:id", jwtTokenPermission, CheckVehicleCategoryDeleteAccess, MakeController.delete);

router.get('/make-model/list', jwtTokenPermission, checkVehicleCategoryListAccess, MakeModelController.list);
router.get('/make-model/list/:isAll', jwtTokenPermission, checkVehicleCategoryListAccess, MakeModelController.list);
router.post('/make-model/save', jwtTokenPermission, checkVehicleCategorySaveAccess, MakeModelValidation, formValidation, MakeModelController.save);
router.delete("/make-model/delete/:id", jwtTokenPermission, CheckVehicleCategoryDeleteAccess, MakeModelController.delete);

router.get('/category/list', jwtTokenPermission, checkVehicleCategoryListAccess, CategoryConteroller.list);
router.get('/category/list/:isAll', jwtTokenPermission, checkVehicleCategoryListAccess, CategoryConteroller.list);
router.post('/category/save', jwtTokenPermission, checkVehicleCategorySaveAccess, vehicleCategoryValidation, formValidation, CategoryConteroller.save);
router.delete("/category/delete/:id", jwtTokenPermission, CheckVehicleCategoryDeleteAccess, CategoryConteroller.delete);

router.get('/list', jwtTokenPermission, checkVehicleListAccess, VehicleController.list);
router.get('/list/:isAll', jwtTokenPermission, checkVehicleListAccess, VehicleController.list);
router.post('/save', jwtTokenPermission, checkVehicleSaveAccess,  vehicleValidation, formValidation, VehicleController.save);
router.delete("/delete/:id", jwtTokenPermission, CheckVehicleDeleteAccess, VehicleController.delete);

async function checkVehicleCategoryListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewVehicleCategory'); };
async function checkVehicleCategorySaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editVehicleCategory' : 'addVehicleCategory', true); };
async function CheckVehicleCategoryDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteVehicleCategory'); };

async function checkVehicleListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewVehicle'); };
async function checkVehicleSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editVehicle' : 'addVehicle', true); };
async function CheckVehicleDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteVehicle'); };


export default router;
