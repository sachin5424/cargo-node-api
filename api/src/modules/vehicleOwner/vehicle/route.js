import { Router } from "express";
import { vehicleValidation } from "../../../validation/VehicleValidations";
import VehicleController from "../vehicle/VehicleController";

import { listVehicle, saveVehicle, deleteVehicle, validateVehicleOwnership, validateDriverOwnership } from "./_middleware";

const router = Router({ mergeParams: true });

router.get('/list', listVehicle, VehicleController.list);
router.post('/save', saveVehicle, validateVehicleOwnership, vehicleValidation, validateDriverOwnership, VehicleController.save);
router.delete("/delete/:id", deleteVehicle, validateVehicleOwnership, VehicleController.delete);

export default router;
