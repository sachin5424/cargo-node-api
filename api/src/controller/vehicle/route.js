import { Router } from "express";
import CategoryConteroller from "./CategoryConteroller";
import { vehicalCategorieValidation, updatedVehicalCategorieValidation } from "../../validation";
import { jwtTokenPermission } from "../../settings/import";

const router = Router({ mergeParams: true });

router.post("/category", jwtTokenPermission, vehicalCategorieValidation, CategoryConteroller.addVehicalCategorie);
router.get("/category",  CategoryConteroller.getVehicalCategorie);
router.get("/category/:id", CategoryConteroller.detailsVehicalCategorie);
router.put("/category/:id", jwtTokenPermission, updatedVehicalCategorieValidation, CategoryConteroller.updateVehicalCategorie);

export default router;
