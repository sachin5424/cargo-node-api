"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateTehsilAdmin = exports.validateSuperAdminORStateAdminORDistrict = exports.validateSuperAdminORStateAdmin = exports.validateSuperAdmin = exports.validateStateAdmin = exports.validateDistrictAdmin = exports.validateCustomAdmin = exports.validateAnyOneAdmin = exports.checkAdminPermission = void 0;

var _adminModules = _interopRequireDefault(require("../data-base/models/adminModules"));

var _modue = _interopRequireDefault(require("../data-base/models/modue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validateSuperAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 8);
};

exports.validateSuperAdmin = validateSuperAdmin;

const validateStateAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 4);
};

exports.validateStateAdmin = validateStateAdmin;

const validateDistrictAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 2);
};

exports.validateDistrictAdmin = validateDistrictAdmin;

const validateTehsilAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 1);
};

exports.validateTehsilAdmin = validateTehsilAdmin;

const validateSuperAdminORStateAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 12);
};

exports.validateSuperAdminORStateAdmin = validateSuperAdminORStateAdmin;

const validateSuperAdminORStateAdminORDistrict = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 14);
};

exports.validateSuperAdminORStateAdminORDistrict = validateSuperAdminORStateAdminORDistrict;

const validateAnyOneAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 15);
};

exports.validateAnyOneAdmin = validateAnyOneAdmin;

const validateCustomAdmin = async (req, res, next, num) => {
  /* 
   * For Super Admin          add 8
   * For State Admin          add 4
   * For District Admin       add 2
   * For Taluk Admin          add 1
   */
  num = "0000" + (num >>> 0).toString(2);
  num = num.substring(num.length - 4);
  const totalPermissions = [num[0] * 1 ? 'superAdmin' : '', num[1] * 1 ? 'stateAdmin' : '', num[2] * 1 ? 'districtAdmin' : '', num[3] * 1 ? 'talukAdmin' : ''];

  try {
    const cuser = global.cuser;

    if (totalPermissions?.includes(cuser.type)) {
      next();
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized"
    });
  }
};

exports.validateCustomAdmin = validateCustomAdmin;

const checkAdminPermission = async (req, res, next, module, fillSDTValues = false, ...idKeys) => {
  const response = {
    statusCode: 401,
    message: "Unauthorized",
    status: false
  };

  if (!idKeys.length) {
    idKeys = ['state', 'district', 'taluk'];
  }

  try {
    const userType = global.cuser.type;

    if (userType === 'superAdmin') {
      response.status = true;
      response.statusCode = 200;
    } else if (userType === 'stateAdmin' || userType === 'districtAdmin' || userType === 'talukAdmin') {
      const moduleData = await _modue.default.findOne({
        key: module
      }).select('key');
      const moduleKey = moduleData.key;
      const adminModules = await _adminModules.default.findOne({
        typeKey: userType
      });

      if (adminModules && adminModules.grantedModules.includes(moduleKey)) {
        response.status = true;
        response.statusCode = 200;

        if (fillSDTValues) {
          const cuser = global.cuser;

          if (cuser.type === 'stateAdmin') {
            req.body[idKeys[0]] = cuser.state.toString();
          } else if (cuser.type === 'districtAdmin') {
            req.body[idKeys[0]] = cuser.state;
            req.body[idKeys[1]] = cuser.district;
          } else if (cuser.type === 'talukAdmin') {
            req.body[idKeys[0]] = cuser.state;
            req.body[idKeys[1]] = cuser.district;
            req.body[idKeys[2]] = cuser.taluk;
          }
        }
      }
    }
  } catch (e) {} finally {
    if (response.status) {
      next();
    } else {
      res.status(response.statusCode).send(response);
    }
  }
};

exports.checkAdminPermission = checkAdminPermission;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3ZhbGlkYXRlQWRtaW4uanMiXSwibmFtZXMiOlsidmFsaWRhdGVTdXBlckFkbWluIiwicmVxIiwicmVzIiwibmV4dCIsInZhbGlkYXRlQ3VzdG9tQWRtaW4iLCJ2YWxpZGF0ZVN0YXRlQWRtaW4iLCJ2YWxpZGF0ZURpc3RyaWN0QWRtaW4iLCJ2YWxpZGF0ZVRlaHNpbEFkbWluIiwidmFsaWRhdGVTdXBlckFkbWluT1JTdGF0ZUFkbWluIiwidmFsaWRhdGVTdXBlckFkbWluT1JTdGF0ZUFkbWluT1JEaXN0cmljdCIsInZhbGlkYXRlQW55T25lQWRtaW4iLCJudW0iLCJ0b1N0cmluZyIsInN1YnN0cmluZyIsImxlbmd0aCIsInRvdGFsUGVybWlzc2lvbnMiLCJjdXNlciIsImdsb2JhbCIsImluY2x1ZGVzIiwidHlwZSIsIkVycm9yIiwiZXJyb3IiLCJzdGF0dXMiLCJqc29uIiwibWVzc2FnZSIsImNoZWNrQWRtaW5QZXJtaXNzaW9uIiwibW9kdWxlIiwiZmlsbFNEVFZhbHVlcyIsImlkS2V5cyIsInJlc3BvbnNlIiwic3RhdHVzQ29kZSIsInVzZXJUeXBlIiwibW9kdWxlRGF0YSIsIk1vZHVsZU1vZGVsIiwiZmluZE9uZSIsImtleSIsInNlbGVjdCIsIm1vZHVsZUtleSIsImFkbWluTW9kdWxlcyIsIkFkbWluTW9kdWxlc01vZGVsIiwidHlwZUtleSIsImdyYW50ZWRNb2R1bGVzIiwiYm9keSIsInN0YXRlIiwiZGlzdHJpY3QiLCJ0YWx1ayIsImUiLCJzZW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDTyxNQUFNQSxrQkFBa0IsR0FBRyxPQUFPQyxHQUFQLEVBQVlDLEdBQVosRUFBaUJDLElBQWpCLEtBQTBCO0FBQUVDLEVBQUFBLG1CQUFtQixDQUFDSCxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWCxFQUFpQixDQUFqQixDQUFuQjtBQUF5QyxDQUFoRzs7OztBQUNBLE1BQU1FLGtCQUFrQixH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QUFBQSxHQUFHLENBQUNvQixNQUFKLENBQVdPLFFBQVEsQ0FBQ0MsVUFBcEIsRUFBZ0NpQixJQUFoQyxDQUFxQ2xCLFFBQXJDO0FBQ0g7QUFDSjtBQUNKLENBNUNNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFkbWluTW9kdWxlc01vZGVsIGZyb20gXCIuLi9kYXRhLWJhc2UvbW9kZWxzL2FkbWluTW9kdWxlc1wiO1xyXG5pbXBvcnQgTW9kdWxlTW9kZWwgZnJvbSBcIi4uL2RhdGEtYmFzZS9tb2RlbHMvbW9kdWVcIjtcclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlU3VwZXJBZG1pbiA9IGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4geyB2YWxpZGF0ZUN1c3RvbUFkbWluKHJlcSwgcmVzLCBuZXh0LCA4KTsgfVxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVTdGF0ZUFkbWluID0gYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7IHZhbGlkYXRlQ3VzdG9tQWRtaW4ocmVxLCByZXMsIG5leHQsIDQpOyB9XHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZURpc3RyaWN0QWRtaW4gPSBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHsgdmFsaWRhdGVDdXN0b21BZG1pbihyZXEsIHJlcywgbmV4dCwgMik7IH1cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVGVoc2lsQWRtaW4gPSBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHsgdmFsaWRhdGVDdXN0b21BZG1pbihyZXEsIHJlcywgbmV4dCwgMSk7IH1cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlU3VwZXJBZG1pbk9SU3RhdGVBZG1pbiA9IGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4geyB2YWxpZGF0ZUN1c3RvbUFkbWluKHJlcSwgcmVzLCBuZXh0LCAxMik7IH1cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlU3VwZXJBZG1pbk9SU3RhdGVBZG1pbk9SRGlzdHJpY3QgPSBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHsgdmFsaWRhdGVDdXN0b21BZG1pbihyZXEsIHJlcywgbmV4dCwgMTQpOyB9XHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUFueU9uZUFkbWluID0gYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7IHZhbGlkYXRlQ3VzdG9tQWRtaW4ocmVxLCByZXMsIG5leHQsIDE1KTsgfVxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUN1c3RvbUFkbWluID0gYXN5bmMgKHJlcSwgcmVzLCBuZXh0LCBudW0pID0+IHtcclxuXHJcbiAgICAvKiBcclxuICAgICAqIEZvciBTdXBlciBBZG1pbiAgICAgICAgICBhZGQgOFxyXG4gICAgICogRm9yIFN0YXRlIEFkbWluICAgICAgICAgIGFkZCA0XHJcbiAgICAgKiBGb3IgRGlzdHJpY3QgQWRtaW4gICAgICAgYWRkIDJcclxuICAgICAqIEZvciBUYWx1ayBBZG1pbiAgICAgICAgICBhZGQgMVxyXG4gICAgICovXHJcblxyXG4gICAgbnVtID0gKFwiMDAwMFwiICsgKChudW0gPj4+IDApLnRvU3RyaW5nKDIpKSk7XHJcbiAgICBudW0gPSBudW0uc3Vic3RyaW5nKG51bS5sZW5ndGggLSA0KTtcclxuXHJcbiAgICBjb25zdCB0b3RhbFBlcm1pc3Npb25zID0gW1xyXG4gICAgICAgIG51bVswXSAqIDEgPyAnc3VwZXJBZG1pbicgOiAnJyxcclxuICAgICAgICBudW1bMV0gKiAxID8gJ3N0YXRlQWRtaW4nIDogJycsXHJcbiAgICAgICAgbnVtWzJdICogMSA/ICdkaXN0cmljdEFkbWluJyA6ICcnLFxyXG4gICAgICAgIG51bVszXSAqIDEgPyAndGFsdWtBZG1pbicgOiAnJyxcclxuICAgIF07XHJcblxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgY3VzZXIgPSBnbG9iYWwuY3VzZXI7XHJcbiAgICAgICAgaWYgKHRvdGFsUGVybWlzc2lvbnM/LmluY2x1ZGVzKGN1c2VyLnR5cGUpKSB7XHJcbiAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmF1dGhvcml6ZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMSkuanNvbih7IG1lc3NhZ2U6IFwiVW5hdXRob3JpemVkXCIgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY2hlY2tBZG1pblBlcm1pc3Npb24gPSBhc3luYyAocmVxLCByZXMsIG5leHQsIG1vZHVsZSwgZmlsbFNEVFZhbHVlcyA9IGZhbHNlLCAuLi5pZEtleXMpID0+IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0geyBzdGF0dXNDb2RlOiA0MDEsIG1lc3NhZ2U6IFwiVW5hdXRob3JpemVkXCIsIHN0YXR1czogZmFsc2UgfTtcclxuICAgIGlmICghaWRLZXlzLmxlbmd0aCkge1xyXG4gICAgICAgIGlkS2V5cyA9IFsnc3RhdGUnLCAnZGlzdHJpY3QnLCAndGFsdWsnXTtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHVzZXJUeXBlID0gZ2xvYmFsLmN1c2VyLnR5cGU7XHJcblxyXG4gICAgICAgIGlmICh1c2VyVHlwZSA9PT0gJ3N1cGVyQWRtaW4nKSB7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh1c2VyVHlwZSA9PT0gJ3N0YXRlQWRtaW4nIHx8IHVzZXJUeXBlID09PSAnZGlzdHJpY3RBZG1pbicgfHwgdXNlclR5cGUgPT09ICd0YWx1a0FkbWluJykge1xyXG4gICAgICAgICAgICBjb25zdCBtb2R1bGVEYXRhID0gYXdhaXQgTW9kdWxlTW9kZWwuZmluZE9uZSh7a2V5OiBtb2R1bGV9KS5zZWxlY3QoJ2tleScpO1xyXG4gICAgICAgICAgICBjb25zdCBtb2R1bGVLZXkgPSBtb2R1bGVEYXRhLmtleTtcclxuICAgICAgICAgICAgY29uc3QgYWRtaW5Nb2R1bGVzID0gYXdhaXQgQWRtaW5Nb2R1bGVzTW9kZWwuZmluZE9uZSh7IHR5cGVLZXk6IHVzZXJUeXBlIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFkbWluTW9kdWxlcyAmJiBhZG1pbk1vZHVsZXMuZ3JhbnRlZE1vZHVsZXMuaW5jbHVkZXMobW9kdWxlS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSAyMDA7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGxTRFRWYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXNlciA9IGdsb2JhbC5jdXNlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1c2VyLnR5cGUgPT09ICdzdGF0ZUFkbWluJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXEuYm9keVtpZEtleXNbMF1dID0gY3VzZXIuc3RhdGUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1c2VyLnR5cGUgPT09ICdkaXN0cmljdEFkbWluJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXEuYm9keVtpZEtleXNbMF1dID0gY3VzZXIuc3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5ib2R5W2lkS2V5c1sxXV0gPSBjdXNlci5kaXN0cmljdDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1c2VyLnR5cGUgPT09ICd0YWx1a0FkbWluJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXEuYm9keVtpZEtleXNbMF1dID0gY3VzZXIuc3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5ib2R5W2lkS2V5c1sxXV0gPSBjdXNlci5kaXN0cmljdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxLmJvZHlbaWRLZXlzWzJdXSA9IGN1c2VyLnRhbHVrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHsgfSBmaW5hbGx5IHtcclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKHJlc3BvbnNlLnN0YXR1c0NvZGUpLnNlbmQocmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==