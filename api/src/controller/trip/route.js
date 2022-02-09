import { Router } from "express";
import CategoriesController from "./CategoriesController";
import { jwtTokenPermission } from "../../settings/import";
import { vehicalCategorieValidation, updatedVehicalCategorieValidation } from "../../validation";

const router = Router({ mergeParams: true });


router.post('/categorie', jwtTokenPermission, vehicalCategorieValidation, CategoriesController.addVehicalCategorie);
router.get('/categorie', CategoriesController.getVehicalCategorie);
router.get('/categorie/:id', CategoriesController.detailsVehicalCategorie);
router.put('/categorie/:id', jwtTokenPermission, updatedVehicalCategorieValidation, CategoriesController.updateVehicalCategorie);


export default router;
