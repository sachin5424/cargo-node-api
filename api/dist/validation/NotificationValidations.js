"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notificationValidation = void 0;

var _import = require("../settings/import");

var _notification = _interopRequireDefault(require("../data-base/models/notification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const notificationValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _notification.default.findOne({
      _id: v
    });

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('to').notEmpty().withMessage("The 'Send To' field is required").isIn(['manyCustomers', 'manyDrivers', 'manyAdmins', 'allCustomers', 'allDrivers', 'allAdmins']).withMessage("The 'Send To' field is not valid"), (0, _import.check)('content').notEmpty().withMessage("The 'Content' field is required").isString().withMessage("The 'Content' field is not valid")];
exports.notificationValidation = notificationValidation;