import { Router } from "express";
import { validateAnyOneAdmin } from "../../middleware/validateAdmin";
import CustomerController from "./CustomerController";
import { customerValidation } from "./_Validations";
import { jwtTokenPermission } from "../../middleware/jwtToken";

const router = Router({ mergeParams: true });

router.get('/list', jwtTokenPermission, (req, res, next) => {validateAnyOneAdmin(req, res, next, 15)}, CustomerController.list);
router.post('/save', jwtTokenPermission, customerValidation, CustomerController.save);
router.delete("/delete/:id", jwtTokenPermission, CustomerController.delete);

router.post('/register', (req, res, next)=>{ req.body.isActive = false; next(); }, customerValidation, CustomerController.save)


export default router;
