import { Router } from "express";
import CategoryConteroller from "./CategoryConteroller";
import TypeController from "./TypeController";
import ModelController from "./ModelController";
import VehicleController from "./VehicleController";
import OwnerConteroller from "./OwnerConteroller";
import { typeValidation, modelValidation, vehicleValidation, vehicleOwnerValidation, vehicleCategoryValidation} from "../../../validation/VehicleValidations";
import { jwtTokenPermission } from "../../../settings/import";
import { checkAdminPermission } from "../../../middleware/validateAdmin";
import { formValidation } from "../../../middleware/others";

const router = Router({ mergeParams: true });

router.get('/owner/list', OwnerConteroller.list);
router.post('/owner/save', jwtTokenPermission,  vehicleOwnerValidation, OwnerConteroller.save);
router.delete("/owner/delete/:id", jwtTokenPermission, OwnerConteroller.delete);

router.get('/category/list', jwtTokenPermission, checkVehicleCategoryListAccess, CategoryConteroller.list);
router.get('/category/list/:isAll', jwtTokenPermission, checkVehicleCategoryListAccess, CategoryConteroller.list);
router.post('/category/save', jwtTokenPermission, checkVehicleCategorySaveAccess, vehicleCategoryValidation, formValidation, CategoryConteroller.save);
router.delete("/category/delete/:id", jwtTokenPermission, CheckVehicleCategoryDeleteAccess, CategoryConteroller.delete);

router.get('/type/list', TypeController.list);
router.post('/type/save', jwtTokenPermission,  typeValidation, TypeController.save);
router.delete("/type/delete/:id", jwtTokenPermission, TypeController.delete);

router.get('/model/list', ModelController.list);
router.post('/model/save', jwtTokenPermission,  modelValidation, ModelController.save);
router.delete("/model/delete/:id", jwtTokenPermission, ModelController.delete);


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
