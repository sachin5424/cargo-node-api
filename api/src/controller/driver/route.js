import { Router } from "express";
import { validateAnyOneAdmin } from "../../middleware/validateAdmin";
import DriverController from "./DriverController";
import { driverValidation } from "./_Validations";

const router = Router({ mergeParams: true });

router.get('/list', (req, res, next) => {validateAnyOneAdmin(req, res, next, 15)}, DriverController.list);
router.post('/save', driverValidation, DriverController.save);
router.delete("/delete/:id", DriverController.delete);


export default router;
