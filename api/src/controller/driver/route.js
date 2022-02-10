import { Router } from "express";
import DriverController from "./DriverController";
import { driverValidation } from "./_Validations";

const router = Router({ mergeParams: true });

router.get('/list', DriverController.list);
router.post('/save', driverValidation, DriverController.save);
router.delete("/delete/:id", DriverController.delete);


export default router;
