"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _jwtToken = require("../../../middleware/jwtToken");

var _SDTController = _interopRequireDefault(require("./SDTController"));

var _StateController = _interopRequireDefault(require("./StateController"));

var _DistrictController = _interopRequireDefault(require("./DistrictController"));

var _TalukController = _interopRequireDefault(require("./TalukController"));

var _validateAdmin = require("../../../middleware/validateAdmin");

var _SDTValidation = require("../../../validation/SDTValidation");

var _others = require("../../../middleware/others");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/sdt', _jwtToken.jwtTokenPermission, _SDTController.default.sdtList);
router.get('/state/list', _jwtToken.jwtTokenPermission, checkStateViewAccess, _StateController.default.list);
router.get('/state/list/:isAll', _jwtToken.jwtTokenPermission, checkStateViewAccess, _StateController.default.list);
router.post("/state/save", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdmin, checkStateSaveAccess, _SDTValidation.stateValidation, _others.formValidation, _StateController.default.save);
router.delete("/state/delete/:id", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdmin, CheckStateDeleteAccess, _StateController.default.delete);
router.get('/district/list', _jwtToken.jwtTokenPermission, checkDistrictViewAccess, _DistrictController.default.list);
router.get('/district/list/:isAll', _jwtToken.jwtTokenPermission, checkDistrictViewAccess, _DistrictController.default.list);
router.post("/district/save", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdminORStateAdmin, checkDistrictSaveAccess, _SDTValidation.districtValidation, _others.formValidation, _DistrictController.default.save);
router.delete("/district/delete/:id", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdminORStateAdmin, CheckDistrictDeleteAccess, _DistrictController.default.delete);
router.get('/taluk/list', _jwtToken.jwtTokenPermission, checkTalukViewAccess, _TalukController.default.list);
router.get('/taluk/list/:isAll', _jwtToken.jwtTokenPermission, checkTalukViewAccess, _TalukController.default.list);
router.post("/taluk/save", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdminORStateAdminORDistrict, checkTalukSaveAccess, _SDTValidation.talukValidation, _others.formValidation, _TalukController.default.save);
router.delete("/taluk/delete/:id", _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdminORStateAdminORDistrict, CheckTalukDeleteAccess, _TalukController.default.delete);

async function checkStateViewAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewState');
}

;

async function checkStateSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editState' : 'addState', true);
}

;

async function CheckStateDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteState');
}

;

async function checkDistrictViewAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewDistrict');
}

;

async function checkDistrictSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editDistrict' : 'addDistrict', true);
}

;

async function CheckDistrictDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteDistrict');
}

;

async function checkTalukViewAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewTaluk');
}

;

async function checkTalukSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editTaluk' : 'addTaluk', true);
}

;

async function CheckTalukDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteTaluk');
}

;
var _default = router;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL3NkdC9yb3V0ZS5qcyJdLCJuYW1lcyI6WyJyb3V0ZXIiLCJtZXJnZVBhcmFtcyIsImdldCIsImp3dFRva2VuUGVybWlzc2lvbiIsIlNEVENvbnRyb2xsZXIiLCJzZHRMaXN0IiwiY2hlY2tTdGF0ZVZpZXdBY2Nlc3MiLCJTdGF0ZUNvbnRyb2xsZXIiLCJsaXN0IiwicG9zdCIsInZhbGlkYXRlU3VwZXJBZG1pbiIsImNoZWNrU3RhdGVTYXZlQWNjZXNzIiwic3RhdGVWYWxpZGF0aW9uIiwiZm9ybVZhbGlkYXRpb24iLCJzYXZlIiwiZGVsZXRlIiwiQ2hlY2tTdGF0ZURlbGV0ZUFjY2VzcyIsImNoZWNrRGlzdHJpY3RWaWV3QWNjZXNzIiwiRGlzdHJpY3RDb250cm9sbGVyIiwidmFsaWRhdGVTdXBlckFkbWluT1JTdGF0ZUFkbWluIiwiY2hlY2tEaXN0cmljdFNhdmVBY2Nlc3MiLCJkaXN0cmljdFZhbGlkYXRpb24iLCJDaGVja0Rpc3RyaWN0RGVsZXRlQWNjZXNzIiwiY2hlY2tUYWx1a1ZpZXdBY2Nlc3MiLCJUYWx1a0NvbnRyb2xsZXIiLCJ2YWxpZGF0ZVN1cGVyQWRtaW5PUlN0YXRlQWRtaW5PUkRpc3RyaWN0IiwiY2hlY2tUYWx1a1NhdmVBY2Nlc3MiLCJ0YWx1a1ZhbGlkYXRpb24iLCJDaGVja1RhbHVrRGVsZXRlQWNjZXNzIiwicmVxIiwicmVzIiwibmV4dCIsImJvZHkiLCJfaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUdBLE1BQU1BLE1BQU0sR0FBRyxxQkFBTztBQUFFQyxFQUFBQSxXQUFXLEVBQUU7QUFBZixDQUFQLENBQWY7QUFFQUQsTUFBTSxDQUFDRSxHQUFQLENBQVcsTUFBWCxFQUFtQkMsNEJBQW5CLEVBQXVDQyx1QkFBY0MsT0FBckQ7QUFFQUwsTUFBTSxDQUFDRSxHQUFQLENBQVcs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ckIsRUFBMEJDLEdBQTFCLEVBQStCQyxJQUEvQixFQUFxQ0YsR0FBRyxDQUFDRyxJQUFKLENBQVNDLEdBQVQsR0FBZSxjQUFmLEdBQWdDLGFBQXJFLEVBQW9GLElBQXBGO0FBQTRGOztBQUFBOztBQUN0SixlQUFlWCx5QkFBZixDQUEwQ08sR0FBMUMsRUFBK0NDLEdBQS9DLEVBQW9EQyxJQUFwRCxFQUEwRDtBQUFFLDJDQUFxQkYsR0FBckIsRUFBMEJDLEdBQTFCLEVBQStCQyxJQUEvQixFQUFxQyxnQkFBckM7QUFBeUQ7O0FBQUE7O0FBRXJILGVBQWVSLG9CQUFmLENBQXFDTSxHQUFyQyxFQUEwQ0MsR0FBMUMsRUFBK0NDLElBQS9DLEVBQXFEO0FBQUUsMkNBQXFCRixHQUFyQixFQUEwQkMsR0FBMUIsRUFBK0JDLElBQS9CLEVBQXFDLFdBQXJDO0FBQW9EOztBQUFBOztBQUMzRyxlQUFlTCxvQkFBZixDQUFxQ0csR0FBckMsRUFBMENDLEdBQTFDLEVBQStDQyxJQUEvQyxFQUFxRDtBQUFFLDJDQUFxQkYsR0FBckIsRUFBMEJDLEdBQTFCLEVBQStCQyxJQUEvQixFQUFxQ0YsR0FBRyxDQUFDRyxJQUFKLENBQVNDLEdBQVQsR0FBZSxXQUFmLEdBQTZCLFVBQWxFLEVBQThFLElBQTlFO0FBQXNGOztBQUFBOztBQUM3SSxlQUFlTCxzQkFBZixDQUF1Q0MsR0FBdkMsRUFBNENDLEdBQTVDLEVBQWlEQyxJQUFqRCxFQUF1RDtBQUFFLDJDQUFxQkYsR0FBckIsRUFBMEJDLEdBQTFCLEVBQStCQyxJQUEvQixFQUFxQyxhQUFyQztBQUFzRDs7QUFBQTtlQUVoRy9CLE0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgeyBqd3RUb2tlblBlcm1pc3Npb24gfSBmcm9tIFwiLi4vLi4vLi4vbWlkZGxld2FyZS9qd3RUb2tlblwiO1xyXG5pbXBvcnQgU0RUQ29udHJvbGxlciBmcm9tIFwiLi9TRFRDb250cm9sbGVyXCI7XHJcbmltcG9ydCBTdGF0ZUNvbnRyb2xsZXIgZnJvbSBcIi4vU3RhdGVDb250cm9sbGVyXCI7XHJcbmltcG9ydCBEaXN0cmljdENvbnRyb2xsZXIgZnJvbSBcIi4vRGlzdHJpY3RDb250cm9sbGVyXCI7XHJcbmltcG9ydCBUYWx1a0NvbnRyb2xsZXIgZnJvbSBcIi4vVGFsdWtDb250cm9sbGVyXCI7XHJcbmltcG9ydCB7IGNoZWNrQWRtaW5QZXJtaXNzaW9uIH0gZnJvbSBcIi4uLy4uLy4uL21pZGRsZXdhcmUvdmFsaWRhdGVBZG1pblwiO1xyXG5pbXBvcnQgeyBzdGF0ZVZhbGlkYXRpb24sIGRpc3RyaWN0VmFsaWRhdGlvbiwgdGFsdWtWYWxpZGF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL3ZhbGlkYXRpb24vU0RUVmFsaWRhdGlvblwiO1xyXG5pbXBvcnQgeyBmb3JtVmFsaWRhdGlvbiB9IGZyb20gXCIuLi8uLi8uLi9taWRkbGV3YXJlL290aGVyc1wiO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZVN1cGVyQWRtaW4sIHZhbGlkYXRlU3VwZXJBZG1pbk9SU3RhdGVBZG1pbiwgdmFsaWRhdGVTdXBlckFkbWluT1JTdGF0ZUFkbWluT1JEaXN0cmljdCB9IGZyb20gXCIuLi8uLi8uLi9taWRkbGV3YXJlL3ZhbGlkYXRlQWRtaW5cIjtcclxuXHJcbmNvbnN0IHJvdXRlciA9IFJvdXRlcih7IG1lcmdlUGFyYW1zOiB0cnVlIH0pO1xyXG5cclxucm91dGVyLmdldCgnL3NkdCcsIGp3dFRva2VuUGVybWlzc2lvbiwgU0RUQ29udHJvbGxlci5zZHRMaXN0KTtcclxuXHJcbnJvdXRlci5nZXQoJy9zdGF0ZS9saXN0Jywgand0VG9rZW5QZXJtaXNzaW9uLCBjaGVja1N0YXRlVmlld0FjY2VzcywgU3RhdGVDb250cm9sbGVyLmxpc3QpO1xyXG5yb3V0ZXIuZ2V0KCcvc3RhdGUvbGlzdC86aXNBbGwnLCBqd3RUb2tlblBlcm1pc3Npb24sIGNoZWNrU3RhdGVWaWV3QWNjZXNzLCBTdGF0ZUNvbnRyb2xsZXIubGlzdCk7XHJcbnJvdXRlci5wb3N0KFwiL3N0YXRlL3NhdmVcIiwgand0VG9rZW5QZXJtaXNzaW9uLCB2YWxpZGF0ZVN1cGVyQWRtaW4sIGNoZWNrU3RhdGVTYXZlQWNjZXNzLCBzdGF0ZVZhbGlkYXRpb24sIGZvcm1WYWxpZGF0aW9uLCBTdGF0ZUNvbnRyb2xsZXIuc2F2ZSApO1xyXG5yb3V0ZXIuZGVsZXRlKFwiL3N0YXRlL2RlbGV0ZS86aWRcIiwgand0VG9rZW5QZXJtaXNzaW9uLCB2YWxpZGF0ZVN1cGVyQWRtaW4sIENoZWNrU3RhdGVEZWxldGVBY2Nlc3MsIFN0YXRlQ29udHJvbGxlci5kZWxldGUpO1xyXG5cclxucm91dGVyLmdldCgnL2Rpc3RyaWN0L2xpc3QnLCBqd3RUb2tlblBlcm1pc3Npb24sIGNoZWNrRGlzdHJpY3RWaWV3QWNjZXNzLCBEaXN0cmljdENvbnRyb2xsZXIubGlzdCk7XHJcbnJvdXRlci5nZXQoJy9kaXN0cmljdC9saXN0Lzppc0FsbCcsIGp3dFRva2VuUGVybWlzc2lvbiwgY2hlY2tEaXN0cmljdFZpZXdBY2Nlc3MsIERpc3RyaWN0Q29udHJvbGxlci5saXN0KTtcclxucm91dGVyLnBvc3QoXCIvZGlzdHJpY3Qvc2F2ZVwiLCBqd3RUb2tlblBlcm1pc3Npb24sIHZhbGlkYXRlU3VwZXJBZG1pbk9SU3RhdGVBZG1pbiwgY2hlY2tEaXN0cmljdFNhdmVBY2Nlc3MsIGRpc3RyaWN0VmFsaWRhdGlvbiwgZm9ybVZhbGlkYXRpb24sIERpc3RyaWN0Q29udHJvbGxlci5zYXZlICk7XHJcbnJvdXRlci5kZWxldGUoXCIvZGlzdHJpY3QvZGVsZXRlLzppZFwiLCBqd3RUb2tlblBlcm1pc3Npb24sIHZhbGlkYXRlU3VwZXJBZG1pbk9SU3RhdGVBZG1pbiwgQ2hlY2tEaXN0cmljdERlbGV0ZUFjY2VzcywgRGlzdHJpY3RDb250cm9sbGVyLmRlbGV0ZSk7XHJcblxyXG5yb3V0ZXIuZ2V0KCcvdGFsdWsvbGlzdCcsIGp3dFRva2VuUGVybWlzc2lvbiwgY2hlY2tUYWx1a1ZpZXdBY2Nlc3MsIFRhbHVrQ29udHJvbGxlci5saXN0KTtcclxucm91dGVyLmdldCgnL3RhbHVrL2xpc3QvOmlzQWxsJywgand0VG9rZW5QZXJtaXNzaW9uLCBjaGVja1RhbHVrVmlld0FjY2VzcywgVGFsdWtDb250cm9sbGVyLmxpc3QpO1xyXG5yb3V0ZXIucG9zdChcIi90YWx1ay9zYXZlXCIsIGp3dFRva2VuUGVybWlzc2lvbiwgdmFsaWRhdGVTdXBlckFkbWluT1JTdGF0ZUFkbWluT1JEaXN0cmljdCwgY2hlY2tUYWx1a1NhdmVBY2Nlc3MsIHRhbHVrVmFsaWRhdGlvbiwgZm9ybVZhbGlkYXRpb24sIFRhbHVrQ29udHJvbGxlci5zYXZlICk7XHJcbnJvdXRlci5kZWxldGUoXCIvdGFsdWsvZGVsZXRlLzppZFwiLCBqd3RUb2tlblBlcm1pc3Npb24sIHZhbGlkYXRlU3VwZXJBZG1pbk9SU3RhdGVBZG1pbk9SRGlzdHJpY3QsIENoZWNrVGFsdWtEZWxldGVBY2Nlc3MsIFRhbHVrQ29udHJvbGxlci5kZWxldGUpO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gY2hlY2tTdGF0ZVZpZXdBY2Nlc3MgKHJlcSwgcmVzLCBuZXh0KSB7IGNoZWNrQWRtaW5QZXJtaXNzaW9uKHJlcSwgcmVzLCBuZXh0LCAndmlld1N0YXRlJyk7IH07XHJcbmFzeW5jIGZ1bmN0aW9uIGNoZWNrU3RhdGVTYXZlQWNjZXNzIChyZXEsIHJlcywgbmV4dCkgeyBjaGVja0FkbWluUGVybWlzc2lvbihyZXEsIHJlcywgbmV4dCwgcmVxLmJvZHkuX2lkID8gJ2VkaXRTdGF0ZScgOiAnYWRkU3RhdGUnLCB0cnVlKTsgfTtcclxuYXN5bmMgZnVuY3Rpb24gQ2hlY2tTdGF0ZURlbGV0ZUFjY2VzcyAocmVxLCByZXMsIG5leHQpIHsgY2hlY2tBZG1pblBlcm1pc3Npb24ocmVxLCByZXMsIG5leHQsICdkZWxldGVTdGF0ZScpOyB9O1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gY2hlY2tEaXN0cmljdFZpZXdBY2Nlc3MgKHJlcSwgcmVzLCBuZXh0KSB7IGNoZWNrQWRtaW5QZXJtaXNzaW9uKHJlcSwgcmVzLCBuZXh0LCAndmlld0Rpc3RyaWN0Jyk7IH07XHJcbmFzeW5jIGZ1bmN0aW9uIGNoZWNrRGlzdHJpY3RTYXZlQWNjZXNzIChyZXEsIHJlcywgbmV4dCkgeyBjaGVja0FkbWluUGVybWlzc2lvbihyZXEsIHJlcywgbmV4dCwgcmVxLmJvZHkuX2lkID8gJ2VkaXREaXN0cmljdCcgOiAnYWRkRGlzdHJpY3QnLCB0cnVlKTsgfTtcclxuYXN5bmMgZnVuY3Rpb24gQ2hlY2tEaXN0cmljdERlbGV0ZUFjY2VzcyAocmVxLCByZXMsIG5leHQpIHsgY2hlY2tBZG1pblBlcm1pc3Npb24ocmVxLCByZXMsIG5leHQsICdkZWxldGVEaXN0cmljdCcpOyB9O1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gY2hlY2tUYWx1a1ZpZXdBY2Nlc3MgKHJlcSwgcmVzLCBuZXh0KSB7IGNoZWNrQWRtaW5QZXJtaXNzaW9uKHJlcSwgcmVzLCBuZXh0LCAndmlld1RhbHVrJyk7IH07XHJcbmFzeW5jIGZ1bmN0aW9uIGNoZWNrVGFsdWtTYXZlQWNjZXNzIChyZXEsIHJlcywgbmV4dCkgeyBjaGVja0FkbWluUGVybWlzc2lvbihyZXEsIHJlcywgbmV4dCwgcmVxLmJvZHkuX2lkID8gJ2VkaXRUYWx1aycgOiAnYWRkVGFsdWsnLCB0cnVlKTsgfTtcclxuYXN5bmMgZnVuY3Rpb24gQ2hlY2tUYWx1a0RlbGV0ZUFjY2VzcyAocmVxLCByZXMsIG5leHQpIHsgY2hlY2tBZG1pblBlcm1pc3Npb24ocmVxLCByZXMsIG5leHQsICdkZWxldGVUYWx1aycpOyB9O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG4iXX0=