"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vehicalCategorieValidation = exports.updatedVehicalCategorieValidation = void 0;

var _import = require("../settings/import");

const validationMessage = {
  required: "This feild is required",
  invalidEmail: "Invalid email addresss",
  invalidPassword: "Invalid email password"
};
let vehicalCategorieValidation = [(0, _import.check)('name').notEmpty().withMessage(validationMessage.required).isString(), (0, _import.check)('icon').optional().notEmpty().withMessage(validationMessage.required).isString(), (0, _import.check)('active').optional().notEmpty().withMessage(validationMessage.required).toBoolean(1 ? true : false)];
exports.vehicalCategorieValidation = vehicalCategorieValidation;
let updatedVehicalCategorieValidation = [(0, _import.check)('name').optional().notEmpty().withMessage(validationMessage.required).isString(), (0, _import.check)('icon').optional().notEmpty().withMessage(validationMessage.required).isString(), (0, _import.check)('active').optional().notEmpty().withMessage(validationMessage.required).isIn([0, 1, 2])];
exports.updatedVehicalCategorieValidation = updatedVehicalCategorieValidation;