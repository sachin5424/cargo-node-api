"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addPermission = exports.addMultiPermission = void 0;

var _expressValidator = require("express-validator");

var _index = require("../data-base/index");

let addPermission = [(0, _expressValidator.check)('userId').notEmpty().withMessage('This field is required'), (0, _expressValidator.check)('permissionId').notEmpty().withMessage('This field is required').custom(async (value, {
  req
}) => {
  const data = await _index.UserAuthModelPermission.findOne({
    userId: req.body.userId,
    permissionId: value
  });

  if (data) {
    return Promise.reject('alread exists this  permission');
  }
})];
exports.addPermission = addPermission;
let addMultiPermission = [(0, _expressValidator.check)('permissionList.*.userId').notEmpty().withMessage('This field is required'), (0, _expressValidator.check)('permissionList.*.permissionId').notEmpty().withMessage('This field is required').custom(async (value, {
  req
}) => {
  var value = [];
  var check_permissionId = [];
  var permissionList = req.body.permissionList;

  for (var i = 0; i < permissionList.length; i++) {
    const data = await _index.UserAuthModelPermission.findOne({
      userId: permissionList[i].userId,
      permissionId: permissionList[i].permissionId
    });

    if (data) {
      return Promise.reject('alread exists this  permission');
    }
  }
})];
exports.addMultiPermission = addMultiPermission;