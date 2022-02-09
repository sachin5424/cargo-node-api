import { Router } from "express";
import CategoryConteroller from "./CategoryConteroller";
import TypeController from "./TypeController";
import {typeValidation} from "./_Validations";
import { vehicalCategorieValidation, updatedVehicalCategorieValidation } from "../../validation";
import { jwtTokenPermission } from "../../settings/import";

const router = Router({ mergeParams: true });

router.post("/category", jwtTokenPermission, vehicalCategorieValidation, CategoryConteroller.addVehicalCategorie);
router.get("/category",  CategoryConteroller.getVehicalCategorie);
router.get("/category/:id", CategoryConteroller.detailsVehicalCategorie);
router.put("/category/:id", jwtTokenPermission, updatedVehicalCategorieValidation, CategoryConteroller.updateVehicalCategorie);

router.get('/type/list', /* jwtTokenPermission, */  typeValidation, TypeController.list);
router.post('/type/save', /* jwtTokenPermission, */  typeValidation, TypeController.save);
router.delete("/type/delete/:id", /* jwtTokenPermission, */ TypeController.delete);

export default router;
