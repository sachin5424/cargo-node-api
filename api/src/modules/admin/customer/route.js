import { Router } from "express";
import { validateAnyOneAdmin, checkAdminPermission} from "../../../middleware/validateAdmin";
import CustomerController from "./CustomerController";
import LocationController from "./LocationController";
import { customerValidation, locationSearch, locationValidation } from "../../../validation/CustomerValidations";
import { jwtTokenPermission } from "../../../middleware/jwtToken";

const router = Router({ mergeParams: true });

router.get('/list', jwtTokenPermission, checkCustomerListAccess, CustomerController.list);
router.get('/list/:isAll', jwtTokenPermission, checkCustomerListAccess, CustomerController.list);
router.post('/save', jwtTokenPermission, checkCustomerSaveAccess, customerValidation, CustomerController.save);
router.delete("/delete/:id", jwtTokenPermission, CheckCustomerDeleteAccess, CustomerController.delete);

router.get('/location/list', jwtTokenPermission, checkCustomerListAccess, locationSearch, LocationController.list);
router.post('/location/save', jwtTokenPermission, checkCustomerSaveAccess, locationValidation, LocationController.save);
router.delete("/location/delete/:id", jwtTokenPermission, CheckCustomerDeleteAccess, LocationController.delete);

export default router;


async function checkCustomerListAccess (req, res, next) { checkAdminPermission(req, res, next, 'viewCustomer'); };
async function checkCustomerSaveAccess (req, res, next) { checkAdminPermission(req, res, next, req.body._id ? 'editCustomer' : 'addCustomer', true); };
async function CheckCustomerDeleteAccess (req, res, next) { checkAdminPermission(req, res, next, 'deleteCustomer'); };