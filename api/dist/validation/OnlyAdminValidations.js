"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adminModuleValidation = void 0;

var _import = require("../settings/import");

var _adminModules = _interopRequireDefault(require("../data-base/models/adminModules"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const adminModuleValidation = [(0, _import.check)('typeKey').isIn(['stateAdmin', 'districtAdmin', 'talukAdmin']).withMessage('This type of admin does not exist. Please refresh and try again').custom(async v => {
  try {
    const r = await _adminModules.default.findOne({
      typeKey: v
    });

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("Error! Refresh and try again.");
  } finally {
    return true;
  }
})];
exports.adminModuleValidation = adminModuleValidation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0aW9uL09ubHlBZG1pblZhbGlkYXRpb25zLmpzIl0sIm5hbWVzIjpbImFkbWluTW9kdWxlVmFsaWRhdGlvbiIsImlzSW4iLCJ3aXRoTWVzc2FnZSIsImN1c3RvbSIsInYiLCJyIiwiQWRtaW5Nb2R1bGVzTW9kZWwiLCJmaW5kT25lIiwidHlwZUtleSIsIkVycm9yIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O0FBR08sTUFBTUEscUJBQXFCLEdBQUcsQ0FDakMsbUJBQU0sU0FBTixFQUNLQyxJQURMLENBQ1UsQ0FBQyxZQUFELEVBQWUsZUFBZixFQUFnQyxZQUFoQyxDQURWLEVBQ3lEQyxXQUR6RCxDQUNxRSxpRUFEckUsRUFFS0MsTUFGTCxDQUVZLE1BQU9DLENBQVAsSUFBYTtBQUNqQixNQUFJO0FBQ0EsVUFBTUMsQ0FBQyxHQUFHLE1BQU1DLHNCQUFrQkMsT0FBbEIsQ0FBMEI7QUFBQ0MsTUFBQUEsT0FBTyxFQUFFSjtBQUFWLEtBQTFCLENBQWhCOztBQUNBLFFBQUksQ0FBQ0MsQ0FBTCxFQUFRO0FBQ0osWUFBTSxJQUFJSSxLQUFKLENBQVUsZ0JBQVYsQ0FBTjtBQUNIO0FBQ0osR0FMRCxDQUtFLE9BQU9DLENBQVAsRUFBVTtBQUNSLFVBQU0sSUFBSUQsS0FBSixDQUFVLCtCQUFWLENBQU47QUFDSCxHQVBELFNBT1M7QUFDTCxXQUFPLElBQVA7QUFDSDtBQUNKLENBYkwsQ0FEaUMsQ0FBOUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVjayB9IGZyb20gJy4uL3NldHRpbmdzL2ltcG9ydCc7XHJcbmltcG9ydCBBZG1pbk1vZHVsZXNNb2RlbCBmcm9tICcuLi9kYXRhLWJhc2UvbW9kZWxzL2FkbWluTW9kdWxlcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGFkbWluTW9kdWxlVmFsaWRhdGlvbiA9IFtcclxuICAgIGNoZWNrKCd0eXBlS2V5JylcclxuICAgICAgICAuaXNJbihbJ3N0YXRlQWRtaW4nLCAnZGlzdHJpY3RBZG1pbicsICd0YWx1a0FkbWluJ10pLndpdGhNZXNzYWdlKCdUaGlzIHR5cGUgb2YgYWRtaW4gZG9lcyBub3QgZXhpc3QuIFBsZWFzZSByZWZyZXNoIGFuZCB0cnkgYWdhaW4nKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHYpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBBZG1pbk1vZHVsZXNNb2RlbC5maW5kT25lKHt0eXBlS2V5OiB2fSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3IhIFJlZnJlc2ggYW5kIHRyeSBhZ2Fpbi5cIik7XHJcbiAgICAgICAgICAgIH0gZmluYWxseXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG5dOyJdfQ==