import { check } from 'express-validator';
import { UserAuthModelPermission } from '../data-base/index';
let addPermission = [
    check('userId').notEmpty().withMessage('This field is required'),
    check('permissionId').notEmpty().withMessage('This field is required').custom(async (value, { req }) => {
        const data = await UserAuthModelPermission.findOne({ userId: req.body.userId, permissionId: value });
        if (data) {
            return Promise.reject('alread exists this  permission');
        }
    })
];
let addMultiPermission = [
    check('permissionList.*.userId').notEmpty().withMessage('This field is required'),
    check('permissionList.*.permissionId').notEmpty().withMessage('This field is required').custom(async (value, { req }) => {
        var value = [];
        var check_permissionId = [];
        var permissionList = req.body.permissionList;
        for (var i = 0; i < permissionList.length; i++) {
            const data = await UserAuthModelPermission.findOne({ userId: permissionList[i].userId, permissionId: permissionList[i].permissionId });
            if (data) {
                return Promise.reject('alread exists this  permission');
            }
        }
    })
];
export { addPermission, addMultiPermission };
