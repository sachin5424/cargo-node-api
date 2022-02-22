import { Router } from "express";
import { driverValidation } from "../../../validation/DriverValidations";
import DriverController from "./DriverController";

import { listDriver, saveDriver, deleteDriver, validateDriverOwnership } from "./_middleware";

const router = Router({ mergeParams: true });

router.get('/list', listDriver, DriverController.list);
router.post('/save', saveDriver, validateDriverOwnership, driverValidation, DriverController.save);
router.delete("/delete/:id", deleteDriver, validateDriverOwnership, DriverController.delete);

export default router;
