"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _validateAdmin = require("../../../middleware/validateAdmin");

var _CustomerController = _interopRequireDefault(require("./CustomerController"));

var _LocationController = _interopRequireDefault(require("./LocationController"));

var _CustomerValidations = require("../../../validation/CustomerValidations");

var _jwtToken = require("../../../middleware/jwtToken");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)({
  mergeParams: true
});
router.get('/list', _jwtToken.jwtTokenPermission, checkCustomerListAccess, _CustomerController.default.list);
router.get('/list/:isAll', _jwtToken.jwtTokenPermission, checkCustomerListAccess, _CustomerController.default.list);
router.post('/save', _jwtToken.jwtTokenPermission, checkCustomerSaveAccess, _CustomerValidations.customerValidation, _CustomerController.default.save);
router.delete("/delete/:id", _jwtToken.jwtTokenPermission, CheckCustomerDeleteAccess, _CustomerController.default.delete);
router.get('/location/list', _jwtToken.jwtTokenPermission, checkCustomerListAccess, _CustomerValidations.locationSearch, _LocationController.default.list);
router.post('/location/save', _jwtToken.jwtTokenPermission, checkCustomerSaveAccess, _CustomerValidations.locationValidation, _LocationController.default.save);
router.delete("/location/delete/:id", _jwtToken.jwtTokenPermission, CheckCustomerDeleteAccess, _LocationController.default.delete);
var _default = router;
exports.default = _default;

async function checkCustomerListAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'viewCustomer');
}

;

async function checkCustomerSaveAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, req.body._id ? 'editCustomer' : 'addCustomer', true);
}

;

async function CheckCustomerDeleteAccess(req, res, next) {
  (0, _validateAdmin.checkAdminPermission)(req, res, next, 'deleteCustomer');
}

;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL2N1c3RvbWVyL3JvdXRlLmpzIl0sIm5hbWVzIjpbInJvdXRlciIsIm1lcmdlUGFyYW1zIiwiZ2V0Iiwiand0VG9rZW5QZXJtaXNzaW9uIiwiY2hlY2tDdXN0b21lckxpc3RBY2Nlc3MiLCJDdXN0b21lckNvbnRyb2xsZXIiLCJsaXN0IiwicG9zdCIsImNoZWNrQ3VzdG9tZXJTYXZlQWNjZXNzIiwiY3VzdG9tZXJWYWxpZGF0aW9uIiwic2F2ZSIsImRlbGV0ZSIsIkNoZWNrQ3VzdG9tZXJEZWxldGVBY2Nlc3MiLCJsb2NhdGlvblNlYXJjaCIsIkxvY2F0aW9uQ29udHJvbGxlciIsImxvY2F0aW9uVmFsaWRhdGlvbiIsInJlcSIsInJlcyIsIm5leHQiLCJib2R5IiwiX2lkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxNQUFNQSxNQUFNLEdBQUcscUJBQU87QUFBRUMsRUFBQUEsV0FBVyxFQUFFO0FBQWYsQ0FBUCxDQUFmO0FBRUFELE1BQU0sQ0FBQ0UsR0FBUCxDQUFXLE9BQVgsRUFBb0JDLDRCQUFwQixFQUF3Q0MsdUJBQXhDLEVBQWlFQyw0QkFBbUJDLElBQXBGO0FBQ0FOLE1BQU0sQ0FBQ0UsR0FBUCxDQUFXLGNBQVgsRUFBMkJDLDRCQUEzQixFQUErQ0MsdUJBQS9DLEVBQXdFQyw0QkFBbUJDLElBQTNGO0FBQ0FOLE1BQU0sQ0FBQ08sSUFBUCxDQUFZLE9BQVosRUFBcUJKLDRCQUFyQixFQUF5Q0ssdUJBQXpDLEVBQWtFQyx1Q0FBbEUsRUFBc0ZKLDRCQUFtQkssSUFBekc7QUFDQVYsTUFBTSxDQUFDVyxNQUFQLENBQWMsYUFBZCxFQUE2QlIsNEJBQTdCLEVBQWlEUyx5QkFBakQsRUFBNEVQLDRCQUFtQk0sTUFBL0Y7QUFFQVgsTUFBTSxDQUFDRSxHQUFQLENBQVcsZ0JBQVgsRUFBNkJDLDRCQUE3QixFQUFpREMsdUJBQWpELEVBQTBFUyxtQ0FBMUUsRUFBMEZDLDRCQUFtQlIsSUFBN0c7QUFDQU4sTUFBTSxDQUFDTyxJQUFQLENBQVksZ0JBQVosRUFBOEJKLDRCQUE5QixFQUFrREssdUJBQWxELEVBQTJFTyx1Q0FBM0UsRUFBK0ZELDRCQUFtQkosSUFBbEg7QUFDQVYsTUFBTSxDQUFDVyxNQUFQLENBQWMsc0JBQWQsRUFBc0NSLDRCQUF0QyxFQUEwRFMseUJBQTFELEVBQXFGRSw0QkFBbUJILE1BQXhHO2VBRWVYLE07OztBQUdmLGVBQWVJLHVCQUFmLENBQXdDWSxHQUF4QyxFQUE2Q0MsR0FBN0MsRUFBa0RDLElBQWxELEVBQXdEO0FBQUUsMkNBQXFCRixHQUFyQixFQUEwQkMsR0FBMUIsRUFBK0JDLElBQS9CLEVBQXFDLGNBQXJDO0FBQXVEOztBQUFBOztBQUNqSCxlQUFlVix1QkFBZixDQUF3Q1EsR0FBeEMsRUFBNkNDLEdBQTdDLEVBQWtEQyxJQUFsRCxFQUF3RDtBQUFFLDJDQUFxQkYsR0FBckIsRUFBMEJDLEdBQTFCLEVBQStCQyxJQUEvQixFQUFxQ0YsR0FBRyxDQUFDRyxJQUFKLENBQVNDLEdBQVQsR0FBZSxjQUFmLEdBQWdDLGFBQXJFLEVBQW9GLElBQXBGO0FBQTRGOztBQUFBOztBQUN0SixlQUFlUix5QkFBZixDQUEwQ0ksR0FBMUMsRUFBK0NDLEdBQS9DLEVBQW9EQyxJQUFwRCxFQUEwRDtBQUFFLDJDQUFxQkYsR0FBckIsRUFBMEJDLEdBQTFCLEVBQStCQyxJQUEvQixFQUFxQyxnQkFBckM7QUFBeUQ7O0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgeyB2YWxpZGF0ZUFueU9uZUFkbWluLCBjaGVja0FkbWluUGVybWlzc2lvbn0gZnJvbSBcIi4uLy4uLy4uL21pZGRsZXdhcmUvdmFsaWRhdGVBZG1pblwiO1xyXG5pbXBvcnQgQ3VzdG9tZXJDb250cm9sbGVyIGZyb20gXCIuL0N1c3RvbWVyQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgTG9jYXRpb25Db250cm9sbGVyIGZyb20gXCIuL0xvY2F0aW9uQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBjdXN0b21lclZhbGlkYXRpb24sIGxvY2F0aW9uU2VhcmNoLCBsb2NhdGlvblZhbGlkYXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vdmFsaWRhdGlvbi9DdXN0b21lclZhbGlkYXRpb25zXCI7XHJcbmltcG9ydCB7IGp3dFRva2VuUGVybWlzc2lvbiB9IGZyb20gXCIuLi8uLi8uLi9taWRkbGV3YXJlL2p3dFRva2VuXCI7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBSb3V0ZXIoeyBtZXJnZVBhcmFtczogdHJ1ZSB9KTtcclxuXHJcbnJvdXRlci5nZXQoJy9saXN0Jywgand0VG9rZW5QZXJtaXNzaW9uLCBjaGVja0N1c3RvbWVyTGlzdEFjY2VzcywgQ3VzdG9tZXJDb250cm9sbGVyLmxpc3QpO1xyXG5yb3V0ZXIuZ2V0KCcvbGlzdC86aXNBbGwnLCBqd3RUb2tlblBlcm1pc3Npb24sIGNoZWNrQ3VzdG9tZXJMaXN0QWNjZXNzLCBDdXN0b21lckNvbnRyb2xsZXIubGlzdCk7XHJcbnJvdXRlci5wb3N0KCcvc2F2ZScsIGp3dFRva2VuUGVybWlzc2lvbiwgY2hlY2tDdXN0b21lclNhdmVBY2Nlc3MsIGN1c3RvbWVyVmFsaWRhdGlvbiwgQ3VzdG9tZXJDb250cm9sbGVyLnNhdmUpO1xyXG5yb3V0ZXIuZGVsZXRlKFwiL2RlbGV0ZS86aWRcIiwgand0VG9rZW5QZXJtaXNzaW9uLCBDaGVja0N1c3RvbWVyRGVsZXRlQWNjZXNzLCBDdXN0b21lckNvbnRyb2xsZXIuZGVsZXRlKTtcclxuXHJcbnJvdXRlci5nZXQoJy9sb2NhdGlvbi9saXN0Jywgand0VG9rZW5QZXJtaXNzaW9uLCBjaGVja0N1c3RvbWVyTGlzdEFjY2VzcywgbG9jYXRpb25TZWFyY2gsIExvY2F0aW9uQ29udHJvbGxlci5saXN0KTtcclxucm91dGVyLnBvc3QoJy9sb2NhdGlvbi9zYXZlJywgand0VG9rZW5QZXJtaXNzaW9uLCBjaGVja0N1c3RvbWVyU2F2ZUFjY2VzcywgbG9jYXRpb25WYWxpZGF0aW9uLCBMb2NhdGlvbkNvbnRyb2xsZXIuc2F2ZSk7XHJcbnJvdXRlci5kZWxldGUoXCIvbG9jYXRpb24vZGVsZXRlLzppZFwiLCBqd3RUb2tlblBlcm1pc3Npb24sIENoZWNrQ3VzdG9tZXJEZWxldGVBY2Nlc3MsIExvY2F0aW9uQ29udHJvbGxlci5kZWxldGUpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNoZWNrQ3VzdG9tZXJMaXN0QWNjZXNzIChyZXEsIHJlcywgbmV4dCkgeyBjaGVja0FkbWluUGVybWlzc2lvbihyZXEsIHJlcywgbmV4dCwgJ3ZpZXdDdXN0b21lcicpOyB9O1xyXG5hc3luYyBmdW5jdGlvbiBjaGVja0N1c3RvbWVyU2F2ZUFjY2VzcyAocmVxLCByZXMsIG5leHQpIHsgY2hlY2tBZG1pblBlcm1pc3Npb24ocmVxLCByZXMsIG5leHQsIHJlcS5ib2R5Ll9pZCA/ICdlZGl0Q3VzdG9tZXInIDogJ2FkZEN1c3RvbWVyJywgdHJ1ZSk7IH07XHJcbmFzeW5jIGZ1bmN0aW9uIENoZWNrQ3VzdG9tZXJEZWxldGVBY2Nlc3MgKHJlcSwgcmVzLCBuZXh0KSB7IGNoZWNrQWRtaW5QZXJtaXNzaW9uKHJlcSwgcmVzLCBuZXh0LCAnZGVsZXRlQ3VzdG9tZXInKTsgfTsiXX0=