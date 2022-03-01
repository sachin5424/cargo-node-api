import { Router } from "express";
import { jwtTokenPermission } from "../../../middleware/jwtToken";
import SDTController from "./SDTController";

const router = Router({ mergeParams: true });

router.get('/sdt', jwtTokenPermission, SDTController.sdtList);

export default router;
