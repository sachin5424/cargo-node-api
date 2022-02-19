import { Router } from "express";
import CategoryConteroller from "./CategoryConteroller";
import TypeController from "./TypeController";
import ModelController from "./ModelController";
import VehicleController from "./VehicleController";
import OwnerConteroller from "./OwnerConteroller";
import { typeValidation, modelValidation, vehicleValidation, vehicleOwnerValidation} from "./_Validations";
import { vehicalCategorieValidation, updatedVehicalCategorieValidation } from "../../../validation";
import { jwtTokenPermission } from "../../../settings/import";

const router = Router({ mergeParams: true });

router.get('/owner/list', OwnerConteroller.list);
router.post('/owner/save', jwtTokenPermission,  vehicleOwnerValidation, OwnerConteroller.save);
router.delete("/owner/delete/:id", jwtTokenPermission, OwnerConteroller.delete);

router.post("/category", jwtTokenPermission, vehicalCategorieValidation, CategoryConteroller.addVehicalCategorie);
router.get("/category",  CategoryConteroller.getVehicalCategorie);
router.get("/category/:id", CategoryConteroller.detailsVehicalCategorie);
router.put("/category/:id", jwtTokenPermission, updatedVehicalCategorieValidation, CategoryConteroller.updateVehicalCategorie);

router.get('/type/list', TypeController.list);
router.post('/type/save', jwtTokenPermission,  typeValidation, TypeController.save);
router.delete("/type/delete/:id", jwtTokenPermission, TypeController.delete);

router.get('/model/list', ModelController.list);
router.post('/model/save', jwtTokenPermission,  modelValidation, ModelController.save);
router.delete("/model/delete/:id", jwtTokenPermission, ModelController.delete);


router.get('/list', VehicleController.list);
router.post('/save', jwtTokenPermission,  vehicleValidation, VehicleController.save);
router.delete("/delete/:id", jwtTokenPermission, VehicleController.delete);

export default router;
