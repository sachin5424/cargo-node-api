import { Router } from "express";
import Controller from "./Controller";
import { adminModuleValidation } from "../../../validation/OnlyAdminValidations";

const router = Router({ mergeParams: true });

router.get('/list-modules', Controller.listModules);
router.get('/admin-modules', Controller.adminModules);
router.post('/save-admin-modules', adminModuleValidation, Controller.saveAdminModules);


export default router;