"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _Controller = _interopRequireDefault(require("./Controller"));

var _OnlyAdminValidations = require("../../../validation/OnlyAdminValidations");

var _validateAdmin = require("../../../middleware/validateAdmin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/list-modules', _Controller.default.listModules);
router.get('/list-modules/:isAll', _Controller.default.listModules);
router.post('/save-module', _validateAdmin.validateSuperAdmin, _Controller.default.saveModule);
router.delete('/delete-module/:_id', _validateAdmin.validateSuperAdmin, _Controller.default.deleteModule);
router.get('/admin-modules', _Controller.default.adminModules);
router.post('/save-admin-modules', _OnlyAdminValidations.adminModuleValidation, _Controller.default.saveAdminModules);
var _default = router;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL29ubHlBZG1pbi9yb3V0ZS5qcyJdLCJuYW1lcyI6WyJyb3V0ZXIiLCJtZXJnZVBhcmFtcyIsImdldCIsIkNvbnRyb2xsZXIiLCJsaXN0TW9kdWxlcyIsInBvc3QiLCJ2YWxpZGF0ZVN1cGVyQWRtaW4iLCJzYXZlTW9kdWxlIiwiZGVsZXRlIiwiZGVsZXRlTW9kdWxlIiwiYWRtaW5Nb2R1bGVzIiwiYWRtaW5Nb2R1bGVWYWxpZGF0aW9uIiwic2F2ZUFkbWluTW9kdWxlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTUEsTUFBTSxHQUFHLHFCQUFPO0FBQUVDLEVBQUFBLFdBQVcsRUFBRTtBQUFmLENBQVAsQ0FBZjtBQUVBRCxNQUFNLENBQUNFLEdBQVAsQ0FBVyxlQUFYLEVBQTRCQyxvQkFBV0MsV0FBdkM7QUFDQUosTUFBTSxDQUFDRSxHQUFQLENBQVcsc0JBQVgsRUFBbUNDLG9CQUFXQyxXQUE5QztBQUNBSixNQUFNLENBQUNLLElBQVAsQ0FBWSxjQUFaLEVBQTRCQyxpQ0FBNUIsRUFBZ0RILG9CQUFXSSxVQUEzRDtBQUNBUCxNQUFNLENBQUNRLE1BQVAsQ0FBYyxxQkFBZCxFQUFxQ0YsaUNBQXJDLEVBQXlESCxvQkFBV00sWUFBcEU7QUFDQVQsTUFBTSxDQUFDRSxHQUFQLENBQVcsZ0JBQVgsRUFBNkJDLG9CQUFXTyxZQUF4QztBQUNBVixNQUFNLENBQUNLLElBQVAsQ0FBWSxxQkFBWixFQUFtQ00sMkNBQW5DLEVBQTBEUixvQkFBV1MsZ0JBQXJFO2VBR2VaLE0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgQ29udHJvbGxlciBmcm9tIFwiLi9Db250cm9sbGVyXCI7XHJcbmltcG9ydCB7IGFkbWluTW9kdWxlVmFsaWRhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi92YWxpZGF0aW9uL09ubHlBZG1pblZhbGlkYXRpb25zXCI7XHJcbmltcG9ydCB7IHZhbGlkYXRlU3VwZXJBZG1pbiB9IGZyb20gXCIuLi8uLi8uLi9taWRkbGV3YXJlL3ZhbGlkYXRlQWRtaW5cIjtcclxuXHJcbmNvbnN0IHJvdXRlciA9IFJvdXRlcih7IG1lcmdlUGFyYW1zOiB0cnVlIH0pO1xyXG5cclxucm91dGVyLmdldCgnL2xpc3QtbW9kdWxlcycsIENvbnRyb2xsZXIubGlzdE1vZHVsZXMpO1xyXG5yb3V0ZXIuZ2V0KCcvbGlzdC1tb2R1bGVzLzppc0FsbCcsIENvbnRyb2xsZXIubGlzdE1vZHVsZXMpO1xyXG5yb3V0ZXIucG9zdCgnL3NhdmUtbW9kdWxlJywgdmFsaWRhdGVTdXBlckFkbWluLCBDb250cm9sbGVyLnNhdmVNb2R1bGUpO1xyXG5yb3V0ZXIuZGVsZXRlKCcvZGVsZXRlLW1vZHVsZS86X2lkJywgdmFsaWRhdGVTdXBlckFkbWluLCBDb250cm9sbGVyLmRlbGV0ZU1vZHVsZSk7XHJcbnJvdXRlci5nZXQoJy9hZG1pbi1tb2R1bGVzJywgQ29udHJvbGxlci5hZG1pbk1vZHVsZXMpO1xyXG5yb3V0ZXIucG9zdCgnL3NhdmUtYWRtaW4tbW9kdWxlcycsIGFkbWluTW9kdWxlVmFsaWRhdGlvbiwgQ29udHJvbGxlci5zYXZlQWRtaW5Nb2R1bGVzKTtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7Il19