"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tripListValidation = void 0;

var _import = require("../../../settings/import");

var _dataBase = require("../../../data-base");

var _driver = _interopRequireDefault(require("../../../data-base/models/driver"));

var _customer = _interopRequireDefault(require("../../../data-base/models/customer"));

var _vehicle = _interopRequireDefault(require("../../../data-base/models/vehicle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tripListValidation = [(0, _import.check)('tripCategory').notEmpty().withMessage("Something went wrong. Please try again!").custom(async value => {
  try {
    const result = await _dataBase.tripCategorieModel.findById(value);

    if (!result) {
      throw new Error("Something went wrong. Please try again!");
    }
  } catch (e) {
    throw new Error("Something went wrong. Please try again!");
  }
}), (0, _import.check)('driver').notEmpty().withMessage("Something went wrong. Please try again!").custom(async value => {
  try {
    const result = await _driver.default.findById(value);

    if (!result) {
      throw new Error("Driver is not available. Please try again!");
    }
  } catch (e) {
    throw new Error("Driver is not available. Please try again!");
  }
}), (0, _import.check)('customer').notEmpty().withMessage("Something went wrong. Please try again!").custom(async value => {
  try {
    const result = await _customer.default.findById(value);

    if (!result) {
      throw new Error("Something went wrong. Please try again!");
    }
  } catch (e) {
    throw new Error("Something went wrong. Please try again!");
  }
}), (0, _import.check)('vehicle').notEmpty().withMessage("Something went wrong. Please try again!").custom(async value => {
  try {
    const result = await _vehicle.default.findById(value);

    if (!result) {
      throw new Error("Vehicle is not available. Please try again!");
    }
  } catch (e) {
    throw new Error("Vehicle is not available. Please try again!");
  }
}), (0, _import.check)('pickupLocation').notEmpty().withMessage("Go back and fill pickup location").matches(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/).withMessage("Pickup location is not valid. Please go back refill pickup location"), (0, _import.check)('destinationLocation').notEmpty().withMessage("Go back and fill destination location").matches(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/).withMessage("Destination location is not valid. Please go back refill destination location")];
exports.tripListValidation = tripListValidation;