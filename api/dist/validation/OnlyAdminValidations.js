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