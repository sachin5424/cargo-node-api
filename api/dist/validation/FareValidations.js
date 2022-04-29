"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fareManagementValidations = void 0;

var _import = require("../settings/import");

var _rideTypeModel = _interopRequireDefault(require("../data-base/models/rideTypeModel"));

var _fareManagement = _interopRequireDefault(require("../data-base/models/fareManagement"));

var _state = _interopRequireDefault(require("../data-base/models/state"));

var _district = _interopRequireDefault(require("../data-base/models/district"));

var _taluk = _interopRequireDefault(require("../data-base/models/taluk"));

var _vehicaleCategoryModel = _interopRequireDefault(require("../data-base/models/vehicaleCategoryModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fareManagementValidations = [(0, _import.check)('_id').optional().custom(async v => {
  try {
    const r = await _fareManagement.default.findById(v);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('rideType').notEmpty().withMessage("The 'Ride Type' field is required").custom(async (value, {
  req
}) => {
  const result = await _rideTypeModel.default.findById(value);

  if (!result) {
    throw new Error("Invalid ride type");
  } else {
    req.body.serviceType = result.serviceType;
  }
}), (0, _import.check)('vehicleCategory').notEmpty().withMessage("The 'Vehicle Category' field is required").custom(async value => {
  const result = await _vehicaleCategoryModel.default.findById(value);

  if (!result) {
    throw new Error("Invalid vehicle category");
  }
}), (0, _import.check)('state').optional().notEmpty().withMessage("'State' field is required").custom(async value => {
  try {
    const result = await _state.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("'State' field is not valid");
  }
}), (0, _import.check)('district').optional().notEmpty().withMessage("'District' is required").custom(async (value, {
  req
}) => {
  try {
    const result = await _district.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }

    req.body.state = result.state;
  } catch (e) {
    throw new Error("'District' is not valid");
  }
}), (0, _import.check)('taluk').optional().notEmpty().withMessage("'Taluk' field is required").custom(async (value, {
  req
}) => {
  try {
    const result = await _taluk.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }

    req.body.district = result.district;
    const resultDistrict = await _district.default.findById(result.district);
    req.body.state = resultDistrict.state;
  } catch (e) {
    throw new Error("'Taluk' field is not valid");
  }
}), (0, _import.check)('baseFare').notEmpty().withMessage("The 'Base Fare' field is required").isNumeric().withMessage("The 'Base Fare' field must be numeric"), (0, _import.check)('bookingFare').notEmpty().withMessage("The 'Booking Fare' field is required").isNumeric().withMessage("The 'Booking Fare' field must be numeric"), (0, _import.check)('perMinuteFare').notEmpty().withMessage("The 'Per Minute Fare' field is required").isNumeric().withMessage("The 'Per Minute Fare' field must be numeric"), (0, _import.check)('cancelCharge').notEmpty().withMessage("The 'Cancel Charge' field is required").isNumeric().withMessage("The 'Cancel Charge' field must be numeric"), (0, _import.check)('waitingCharge').notEmpty().withMessage("The 'Waiting Charge' field is required").isNumeric().withMessage("The 'Waiting Charge' field must be numeric"), (0, _import.check)('adminCommissionType').notEmpty().withMessage("The 'Admin Commission Type' field is required").isIn(['flat', 'percentage']).withMessage("The 'Admin Commission Type' field is not valid"), (0, _import.check)('adminCommissionValue').notEmpty().withMessage("The 'Admin Commission Value' field is required").isNumeric().withMessage("The 'Admin Commission Value' field must be numeric"), (0, _import.check)('perKMCharges').custom(async (value, {
  req
}) => {
  const result = await _rideTypeModel.default.findById(req.body.rideType);

  if (!result) {
    throw new Error("Invalid ride type");
  } else if (["taxi-pickup-drop", "taxi-rentals", "cargo-daily-ride", "cargo-rentals"].includes(result.key)) {
    if (!value) {
      throw new Error("Per KM Charges are required");
    } else if (!Array.isArray(value)) {
      throw new Error("Per KM Charges are not valid");
    } else {
      value.forEach((v, i) => {
        if (!(parseFloat(i === 0 ? 0 : value[i - 1].maxKM) < parseFloat(v.maxKM)) || !v.charge) {
          throw new Error("All maxKM & charges of 'Per KM Charges' must be valid");
        }
      });
    }
  }
})];
exports.fareManagementValidations = fareManagementValidations;