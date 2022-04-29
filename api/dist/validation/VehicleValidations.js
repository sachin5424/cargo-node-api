"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vehicleValidation = exports.vehicleCategoryValidation = exports.MakeValidation = exports.MakeModelValidation = exports.ColorValidation = void 0;

var _import = require("../settings/import");

var _vehicle = _interopRequireDefault(require("../data-base/models/vehicle"));

var _vehicaleCategoryModel = _interopRequireDefault(require("../data-base/models/vehicaleCategoryModel"));

var _serviceType = _interopRequireDefault(require("../data-base/models/serviceType"));

var _rideTypeModel = _interopRequireDefault(require("../data-base/models/rideTypeModel"));

var _make = _interopRequireDefault(require("../data-base/models/make"));

var _makeModel = _interopRequireDefault(require("../data-base/models/makeModel"));

var _color = _interopRequireDefault(require("../data-base/models/color"));

var _state = _interopRequireDefault(require("../data-base/models/state"));

var _district = _interopRequireDefault(require("../data-base/models/district"));

var _taluk = _interopRequireDefault(require("../data-base/models/taluk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ColorValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _color.default.findById(v);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'name' field is required").isString().withMessage("The 'name' field is not valid"), (0, _import.check)('code').notEmpty().withMessage("The 'code' field is required").isSlug().withMessage("The 'code' field is not valid").custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _color.default.findOne({
    isDeleted: false,
    code: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A color already exist with this code");
      }
    } else {
      throw new Error("A color already exist with this code");
    }
  }
}), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.ColorValidation = ColorValidation;
const MakeValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _make.default.findById(v);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'name' field is required").isString().withMessage("The 'name' field is not valid"), (0, _import.check)('key').notEmpty().withMessage("The 'key' field is required").isSlug().withMessage("The 'key' field is not valid").custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _make.default.findOne({
    isDeleted: false,
    key: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A make already exist with this key");
      }
    } else {
      throw new Error("A make already exist with this key");
    }
  }
}), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.MakeValidation = MakeValidation;
const MakeModelValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _makeModel.default.findById(v);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('make').notEmpty().withMessage("'Make' field is required").custom(async value => {
  try {
    const result = await _make.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("'Make' field is not valid");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'name' field is required").isString().withMessage("The 'name' field is not valid"), (0, _import.check)('key').notEmpty().withMessage("The 'key' field is required").isSlug().withMessage("The 'key' field is not valid").custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _makeModel.default.findOne({
    isDeleted: false,
    key: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A make model already exist with this key");
      }
    } else {
      throw new Error("A make model already exist with this key");
    }
  }
}), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.MakeModelValidation = MakeModelValidation;
const vehicleCategoryValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _vehicaleCategoryModel.default.findById(v);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('serviceType').notEmpty().withMessage("The 'Service Type' field is required").custom(async (value, {
  req
}) => {
  const result = await _serviceType.default.findById(value);

  if (!result) {
    throw new Error("Invalid service type");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'name' field is required").isString().withMessage("The 'name' field is not valid"), (0, _import.check)('slug').notEmpty().withMessage("The 'slug' field is required").isSlug().withMessage("The 'slug' field is not valid").custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _vehicaleCategoryModel.default.findOne({
    isDeleted: false,
    slug: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A category already exist with this slug");
      }
    } else {
      throw new Error("A category already exist with this slug");
    }
  }
}), (0, _import.check)('photo').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.photo) {
      throw new Error("The 'Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Photo is not an image"), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.vehicleCategoryValidation = vehicleCategoryValidation;
const vehicleValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _vehicle.default.findById(v);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('vehicleId').notEmpty().withMessage("The 'Vehicle ID' field is required").custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _vehicle.default.findOne({
    vehicleId: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A vehicle already exist with this Vehicle ID");
      }
    } else {
      throw new Error("A vehicle already exist with this Vehicle ID");
    }
  }
}), (0, _import.check)('serviceType').notEmpty().withMessage("The 'Service Type' field is required").custom(async value => {
  try {
    const result = await _serviceType.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("Service Type is not valid");
  }
}), (0, _import.check)('rideTypes').notEmpty().withMessage("The 'Ride Type' field is required").isArray().withMessage("Ride Type is not valid").custom(async value => {
  try {
    value?.forEach(async v => {
      const result = await _rideTypeModel.default.findById(v);

      if (!result) {
        throw new Error("Data not found");
      }
    });
  } catch (e) {
    throw new Error("Ride Type is not valid");
  }
}), (0, _import.check)('vehicleCategory').notEmpty().withMessage("The 'Vehicle Category' field is required").custom(async value => {
  try {
    const result = await _vehicaleCategoryModel.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("Vehicle Category is not valid");
  }
}), (0, _import.check)('make').notEmpty().withMessage("The 'Make' field is required").custom(async value => {
  try {
    const result = await _make.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("Make is not valid");
  }
}), (0, _import.check)('model').notEmpty().withMessage("The 'Model' field is required").custom(async value => {
  try {
    const result = await _makeModel.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("Model is not valid");
  }
}), (0, _import.check)('color').notEmpty().withMessage("The 'Color' field is required").custom(async value => {
  try {
    const result = await _color.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("Color is not valid");
  }
}), (0, _import.check)('manufacturingYear').notEmpty().withMessage("The 'Manufacturing Year' field is required").matches(/^[0-9]{4}$/).withMessage("The 'Manufacturing Year' field is not valid"), (0, _import.check)('name').notEmpty().withMessage("The 'name' field is required").isString().withMessage("The 'name' field is not valid"), (0, _import.check)('vehicleNumber').notEmpty().withMessage("The 'Vehicle Number' field is required").isString().withMessage("The 'Vehicle Number' field is not valid"), (0, _import.check)('availableSeats').optional().isNumeric().withMessage("The 'Available Seats' field is must be a number").custom(async (value, {
  req
}) => {
  try {
    const ServiceType = await _serviceType.default.findById(req.body?.ServiceType);

    if (ServiceType?.key === 'taxi' && !value?.length) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("The 'Available Seats' field is required");
  }
}), (0, _import.check)('availableCapacity').optional().isNumeric().withMessage("The 'Available Capacity' field is must be a number").custom(async (value, {
  req
}) => {
  try {
    const ServiceType = await _serviceType.default.findById(req.body?.ServiceType);

    if (ServiceType?.key === 'cargo' && !value?.length) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("The 'Available Capacity' field is required");
  }
}), (0, _import.check)('state').notEmpty().withMessage("The 'State' field is required") // .isString().withMessage("The 'State' field is not valid")
.custom(async value => {
  try {
    const result = await _state.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("State is not valid");
  }
}), (0, _import.check)('district').notEmpty().withMessage("The 'District' field is required").isString().withMessage("The 'District' field is not valid").custom(async value => {
  try {
    const result = await _district.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("District is not valid");
  }
}), (0, _import.check)('taluk').notEmpty().withMessage("The 'Taluk' field is required").isString().withMessage("The 'Taluk' field is not valid").custom(async value => {
  try {
    const result = await _taluk.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("Taluk is not valid");
  }
}), (0, _import.check)('primaryPhoto').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.primaryPhoto) {
      throw new Error("The 'Primary Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Primary Photo is not an image"), (0, _import.check)('otherPhotos').optional().isArray().withMessage("Other photo field is not valid").custom(value => {
  const temp = value?.find(v => {
    return !v.match(/data:image\/[^;]+;base64[^"]+/);
  });

  if (temp?.length) {
    throw new Error("Other Photo is not an image");
  } else {
    return true;
  }
}), (0, _import.check)('registrationNumber').notEmpty().withMessage("The 'Registration Number' field is required").isString().withMessage("The 'Registration Number' field is not valid"), (0, _import.check)('registrationExpiryDate').notEmpty().withMessage("The 'Registration Expiry Date' field is required").matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Registration Expiry Date' field is not valid"), (0, _import.check)('registrationPhoto').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.registrationPhoto) {
      throw new Error("The 'Registration Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Registration Photo is not an image"), (0, _import.check)('insuranceNumber').notEmpty().withMessage("The 'Insurance Number' field is required").isString().withMessage("The 'Insurance Number' field is not valid"), (0, _import.check)('insuranceExpiryDate').notEmpty().withMessage("The 'Insurance Expirary Date' field is required").matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Insurance Expirary Date' field is not valid"), (0, _import.check)('insurancePhoto').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.insurancePhoto) {
      throw new Error("The 'Insurance Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Insurance Photo is not an image"), (0, _import.check)('permitNumber').notEmpty().withMessage("The 'Permit Number' field is required").isString().withMessage("The 'Permit Number' field is not valid"), (0, _import.check)('permitExpiryDate').notEmpty().withMessage("The 'Permit Expirary Date' field is required").matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Permit Expirary Date' field is not valid"), (0, _import.check)('permitPhoto').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.permitPhoto) {
      throw new Error("The 'Permit Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Permit Photo is not an image"), (0, _import.check)('pollutionNumber').notEmpty().withMessage("The 'Pollution Number' field is required").isString().withMessage("The 'Pollution Number' field is not valid"), (0, _import.check)('pollutionExpiryDate').notEmpty().withMessage("The 'Pollution Expirary Date' field is required").matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Pollution Expirary Date' field is not valid"), (0, _import.check)('pollutionPhoto').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.pollutionPhoto) {
      throw new Error("The 'Pollution Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Pollution Photo is not an image"), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.vehicleValidation = vehicleValidation;