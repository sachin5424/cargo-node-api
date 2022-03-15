import { Router } from "express";
import CategoryConteroller from "./CategoryConteroller";
import VehicleController from "./VehicleController";
import { vehicleValidation, vehicleCategoryValidation} from "../../../validation/VehicleValidations";
import { jwtTokenPermission } from "../../../settings/import";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { formValidation } from "../../../middleware/others";

const router = Router({ mergeParams: true });

router.get('/category/list', jwtTokenPermission, checkVehicleCategoryListAccess, CategoryConteroller.list);
router.get('/category/list/:isAll', jwtTokenPermission, checkVehicleCategoryListAccess, CategoryConteroller.list);
router.post('/category/save', jwtTokenPermission, checkVehicleCategorySaveAccess, vehicleCategoryValidation, formValidation, CategoryConteroller.save);
router.delete("/category/delete/:id", jwtTokenPermission, CheckVehicleCategoryDeleteAccess, CategoryConteroller.delete);

router.get('/list', jwtTokenPermission, checkVehicleListAccess, VehicleController.list);
router.post('/save', jwtTokenPermission, checkVehicleSaveAccess,  vehicleValidation, VehicleController.save);
router.delete("/delete/:id", jwtTokenPermission, CheckVehicleDeleteAccess, VehicleController.delete);

async function checkVehicleCategoryListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewVehicleCategory'); };
async function checkVehicleCategorySaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editVehicleCategory' : 'addVehicleCategory', true); };
async function CheckVehicleCategoryDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteVehicleCategory'); };

async function checkVehicleListAccess (req, res, next) { checkAdminPermission(req, res, next, 'view_vehicles'); };
async function checkVehicleSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'change_vehicles' : 'add_vehicles', true); };
async function CheckVehicleDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'delete_vehicles'); };


export default router;
