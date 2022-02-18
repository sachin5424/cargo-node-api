import { Router } from "express";
import { validateAnyOneAdmin } from "../../middleware/validateAdmin";
import CustomerController from "./CustomerController";
import LocationController from "./LocationController";
import { customerValidation, locationSearch, locationValidation } from "./_Validations";
import { jwtTokenPermission } from "../../middleware/jwtToken";

const router = Router({ mergeParams: true });

router.get('/list', jwtTokenPermission, validateAnyOneAdmin, CustomerController.list);
router.post('/save', jwtTokenPermission, validateAnyOneAdmin, customerValidation, CustomerController.save);
router.delete("/delete/:id", jwtTokenPermission, validateAnyOneAdmin, CustomerController.delete);

router.post('/register', (req, res, next)=>{ req.body.isActive = false; next(); }, customerValidation, CustomerController.save)

router.get('/location/list', jwtTokenPermission, validateAnyOneAdmin, locationSearch, LocationController.list);
router.post('/location/save', jwtTokenPermission, validateAnyOneAdmin, locationValidation, LocationController.save);
router.delete("/location/delete/:id", jwtTokenPermission, validateAnyOneAdmin, LocationController.delete);

export default router;
