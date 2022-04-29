"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _CategoriesController = _interopRequireDefault(require("./CategoriesController"));

var _import = require("../../../settings/import");

var _validation = require("../../../validation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.post('/categorie', _import.jwtTokenPermission, _validation.vehicalCategorieValidation, _CategoriesController.default.addVehicalCategorie);
router.get('/categorie', _CategoriesController.default.getVehicalCategorie);
router.get('/categorie/:id', _CategoriesController.default.detailsVehicalCategorie);
router.put('/categorie/:id', _import.jwtTokenPermission, _validation.updatedVehicalCategorieValidation, _CategoriesController.default.updateVehicalCategorie);
var _default = router;
exports.default = _default;