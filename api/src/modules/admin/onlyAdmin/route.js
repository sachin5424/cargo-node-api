import { Router } from "express";
import Controller from "./Controller";
import { adminModuleValidation } from "../../../validation/OnlyAdminValidations";
import { validateSuperAdmin } from "../../../middleware/validateAdmin";

const router = Router({ mergeParams: true });

router.get('/list-modules', Controller.listModules);
router.get('/list-modules/:isAll', Controller.listModules);
router.post('/save-module', validateSuperAdmin, Controller.saveModule);
router.delete('/delete-module/:_id', validateSuperAdmin, Controller.deleteModule);
router.get('/admin-modules', Controller.adminModules);
router.post('/save-admin-modules', adminModuleValidation, Controller.saveAdminModules);


export default router;