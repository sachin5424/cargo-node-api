"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "addMultiPermission", {
  enumerable: true,
  get: function () {
    return _modelPermission.addMultiPermission;
  }
});
Object.defineProperty(exports, "addPermission", {
  enumerable: true,
  get: function () {
    return _modelPermission.addPermission;
  }
});
Object.defineProperty(exports, "updatedVehicalCategorieValidation", {
  enumerable: true,
  get: function () {
    return _vehical.updatedVehicalCategorieValidation;
  }
});
exports.validationMessage = void 0;
Object.defineProperty(exports, "vehicalCategorieValidation", {
  enumerable: true,
  get: function () {
    return _vehical.vehicalCategorieValidation;
  }
});

var _vehical = require("./vehical.validations");

var _modelPermission = require("./model-permission");

const validationMessage = {
  required: "This feild is required",
  invalidEmail: "Invalid email addresss",
  invalidPassword: "Invalid email password"
};
exports.validationMessage = validationMessage;