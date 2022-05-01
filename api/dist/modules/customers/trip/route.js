"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _TripController = _interopRequireDefault(require("./TripController"));

var _Validations = require("./_Validations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/list', _Validations.tripListValidation, CustomerController.list);
var _default = router;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2N1c3RvbWVycy90cmlwL3JvdXRlLmpzIl0sIm5hbWVzIjpbInJvdXRlciIsIm1lcmdlUGFyYW1zIiwiZ2V0IiwidHJpcExpc3RWYWxpZGF0aW9uIiwiQ3VzdG9tZXJDb250cm9sbGVyIiwibGlzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTUEsTUFBTSxHQUFHLHFCQUFPO0FBQUVDLEVBQUFBLFdBQVcsRUFBRTtBQUFmLENBQVAsQ0FBZjtBQUVBRCxNQUFNLENBQUNFLEdBQVAsQ0FBVyxPQUFYLEVBQW9CQywrQkFBcEIsRUFBd0NDLGtCQUFrQixDQUFDQyxJQUEzRDtlQUVlTCxNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IFRyaXBDb250cm9sbGVyIGZyb20gXCIuL1RyaXBDb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IHRyaXBMaXN0VmFsaWRhdGlvbiB9IGZyb20gXCIuL19WYWxpZGF0aW9uc1wiO1xyXG5cclxuY29uc3Qgcm91dGVyID0gUm91dGVyKHsgbWVyZ2VQYXJhbXM6IHRydWUgfSk7XHJcblxyXG5yb3V0ZXIuZ2V0KCcvbGlzdCcsIHRyaXBMaXN0VmFsaWRhdGlvbiwgQ3VzdG9tZXJDb250cm9sbGVyLmxpc3QpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG4iXX0=