import { Router } from "express";
import PermissionController from "./PermissionController";
import { jwtTokenPermission } from '../../../middleware/jwtToken';
import { addPermission } from '../../../validation/model-permission';

const router = Router({ mergeParams: true });


router.get('/test', jwtTokenPermission, PermissionController.get);
router.get('/', PermissionController.getPermission);
router.post('/', addPermission, PermissionController.addPermission);
router.post('/multi', PermissionController.addMultiPermission);
// router.post('/',PermissionController.validations.addMultiPermission,PermissionController.addMultiPermission)

export default router;
