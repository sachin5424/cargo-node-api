import { Router } from "express";
import TripController from "./TripController";
import { tripListValidation } from "./_Validations";

const router = Router({ mergeParams: true });

router.get('/list', tripListValidation, CustomerController.list);

export default router;
