import { Router } from "express";
import Controller from "./Controller";

const router = Router({ mergeParams: true });

router.get('/list-modules', Controller.listModules);
router.get('/admin-modules', Controller.adminModules);


export default router;