import { Router } from "express";
import CommonController from "./CommonController";

const router = Router({ mergeParams: true });

router.get('/list-states', CommonController.listStates);
router.get('/list-service-type', CommonController.listServiceType);
router.get('/init-db', CommonController.initdb);

export default router;
