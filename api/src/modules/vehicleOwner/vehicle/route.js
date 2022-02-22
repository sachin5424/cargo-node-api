import { Router } from "express";
import { vehicleValidation } from "../../../validation/VehicleValidations";
import VehicleController from "../vehicle/VehicleController";

import { saveVehicle } from "./_middleware";

const router = Router({ mergeParams: true });

router.get('/list', VehicleController.list);
router.post('/save', saveVehicle, vehicleValidation, VehicleController.save);
router.delete("/delete/:id", VehicleController.delete);

export default router;
