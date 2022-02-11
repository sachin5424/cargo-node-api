import { Router } from "express";
import CommonController from "./CommonController";

const router = Router({ mergeParams: true });

router.get('/list-states', CommonController.listStates);

export default router;
