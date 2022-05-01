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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0aW9uL1ZlaGljbGVWYWxpZGF0aW9ucy5qcyJdLCJuYW1lcyI6WyJDb2xvclZhbGlkYXRpb24iLCJvcHRpb25hbCIsIm5vdEVtcHR5Iiwid2l0aE1lc3NhZ2UiLCJjdXN0b20iLCJ2IiwiciIsIkNvbG9yTW9kZWwiLCJmaW5kQnlJZCIsIkVycm9yIiwiZSIsImlzU3RyaW5nIiwiaXNTbHVnIiwidmFsdWUiLCJyZXEiLCJib2R5IiwicmVzdWx0IiwiZmluZE9uZSIsImlzRGVsZXRlZCIsImNvZGUiLCJfaWQiLCJ0b0Jvb2xlYW4iLCJNYWtlVmFsaWRhdGlvbiIsIk1ha2VNb2RlbCIsImtleSIsIk1ha2VNb2RlbFZhbGlkYXRpb24iLCJNYWtlTW9kZWxNb2RlbCIsInZlaGljbGVDYXRlZ29yeVZhbGlkYXRpb24iLCJWZWhpY2xlQ2F0ZWdvcnlNb2RlbCIsIlNlcnZpY2VUeXBlTW9kZWwiLCJzbHVnIiwicGhvdG8iLCJtYXRjaGVzIiwidmVoaWNsZVZhbGlkYXRpb24iLCJWZWhpY2xlTW9kZWwiLCJ2ZWhpY2xlSWQiLCJpc0FycmF5IiwiZm9yRWFjaCIsIlJpZGVUeXBlTW9kZWwiLCJpc051bWVyaWMiLCJTZXJ2aWNlVHlwZSIsImxlbmd0aCIsIlN0YXRlTW9kZWwiLCJEaXN0cmljdE1vZGVsIiwiVGFsdWtNb2RlbCIsInByaW1hcnlQaG90byIsInRlbXAiLCJmaW5kIiwibWF0Y2giLCJyZWdpc3RyYXRpb25QaG90byIsImluc3VyYW5jZVBob3RvIiwicGVybWl0UGhvdG8iLCJwb2xsdXRpb25QaG90byJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sTUFBTUEsZUFBZSxHQUFHLENBRTNCLG1CQUFNLEtBQU4sRUFDS0MsUUFETCxHQUVLQyxRQUZMLEdBRWdCQyxXQUZoQixDQUU0QiwrQkFGNUIsRUFHS0MsTUFI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REwsR0FDZ0JDLFdBRGhCLENBQzRCLGlEQUQ1QixFQUVLNkIsT0FGTCxDQUVhLGtEQUZiLEVBRWlFN0IsV0FGakUsQ0FFNkUsa0RBRjdFLENBcFM2QixFQXdTN0IsbUJBQU0sZ0JBQU4sRUFDS0MsTUFETCxDQUNZLENBQUNDLENBQUQsRUFBSTtBQUFFUyxFQUFBQTtBQUFGLENBQUosS0FBZ0I7QUFDcEIsTUFBSSxDQUFDQSxHQUFHLENBQUNDLElBQUosQ0FBU0ssR0FBZCxFQUFtQjtBQUNmLFFBQUksQ0FBQ04sR0FBRyxDQUFDQyxJQUFKLENBQVNxQyxjQUFkLEVBQThCO0FBQzFCLFlBQU0sSUFBSTNDLEtBQUosQ0FBVSx5Q0FBVixDQUFOO0FBQ0g7QUFDSjs7QUFDRCxTQUFPLElBQVA7QUFDSCxDQVJMLEVBU0tSLFFBVEwsR0FVSytCLE9BVkwsQ0FVYSwrQkFWYixFQVU4QzdCLFdBVjlDLENBVTBELGlDQVYxRCxDQXhTNkIsRUF1VDdCLG1CQUFNLFVBQU4sRUFDS0QsUUFETCxHQUNnQkMsV0FEaEIsQ0FDNEIsZ0NBRDVCLEVBRUtrQixTQUZMLENBRWUsSUFBSSxJQUFKLEdBQVcsS0FGMUIsQ0F2VDZCLENBQTFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2sgfSBmcm9tICcuLi9zZXR0aW5ncy9pbXBvcnQnO1xyXG5pbXBvcnQgVmVoaWNsZU1vZGVsIGZyb20gJy4uL2RhdGEtYmFzZS9tb2RlbHMvdmVoaWNsZSc7XHJcbmltcG9ydCBWZWhpY2xlQ2F0ZWdvcnlNb2RlbCBmcm9tICcuLi9kYXRhLWJhc2UvbW9kZWxzL3ZlaGljYWxlQ2F0ZWdvcnlNb2RlbCc7XHJcbmltcG9ydCBTZXJ2aWNlVHlwZU1vZGVsIGZyb20gJy4uL2RhdGEtYmFzZS9tb2RlbHMvc2VydmljZVR5cGUnO1xyXG5pbXBvcnQgUmlkZVR5cGVNb2RlbCBmcm9tICcuLi9kYXRhLWJhc2UvbW9kZWxzL3JpZGVUeXBlTW9kZWwnO1xyXG5pbXBvcnQgTWFrZU1vZGVsIGZyb20gJy4uL2RhdGEtYmFzZS9tb2RlbHMvbWFrZSc7XHJcbmltcG9ydCBNYWtlTW9kZWxNb2RlbCBmcm9tICcuLi9kYXRhLWJhc2UvbW9kZWxzL21ha2VNb2RlbCc7XHJcbmltcG9ydCBDb2xvck1vZGVsIGZyb20gJy4uL2RhdGEtYmFzZS9tb2RlbHMvY29sb3InO1xyXG5pbXBvcnQgU3RhdGVNb2RlbCBmcm9tICcuLi9kYXRhLWJhc2UvbW9kZWxzL3N0YXRlJztcclxuaW1wb3J0IERpc3RyaWN0TW9kZWwgZnJvbSAnLi4vZGF0YS1iYXNlL21vZGVscy9kaXN0cmljdCc7XHJcbmltcG9ydCBUYWx1a01vZGVsIGZyb20gJy4uL2RhdGEtYmFzZS9tb2RlbHMvdGFsdWsnO1xyXG5cclxuZXhwb3J0IGNvbnN0IENvbG9yVmFsaWRhdGlvbiA9IFtcclxuXHJcbiAgICBjaGVjaygnX2lkJylcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiUHJvdmlkZSAvIFNlbGVjdCBhIHZhbGlkIGRhdGFcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgQ29sb3JNb2RlbC5maW5kQnlJZCh2KTtcclxuICAgICAgICAgICAgICAgIGlmICghcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGEgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGRhdGEgZG9lcyBub3QgZXhpdC4gUGxlYXNlIGNoZWNrIG9yIHJlZnJlc2hcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnbmFtZScpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ25hbWUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmlzU3RyaW5nKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ25hbWUnIGZpZWxkIGlzIG5vdCB2YWxpZFwiKSxcclxuXHJcblxyXG4gICAgY2hlY2soJ2NvZGUnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdjb2RlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc1NsdWcoKS53aXRoTWVzc2FnZShcIlRoZSAnY29kZScgZmllbGQgaXMgbm90IHZhbGlkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUsIHsgcmVxIH0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBDb2xvck1vZGVsLmZpbmRPbmUoeyBpc0RlbGV0ZWQ6IGZhbHNlLCBjb2RlOiB2YWx1ZSB9KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5faWQgIT0gYm9keS5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQSBjb2xvciBhbHJlYWR5IGV4aXN0IHdpdGggdGhpcyBjb2RlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQSBjb2xvciBhbHJlYWR5IGV4aXN0IHdpdGggdGhpcyBjb2RlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ2lzQWN0aXZlJykuXHJcbiAgICAgICAgbm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnYWN0aXZlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC50b0Jvb2xlYW4oMSA/IHRydWUgOiBmYWxzZSksXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgTWFrZVZhbGlkYXRpb24gPSBbXHJcblxyXG4gICAgY2hlY2soJ19pZCcpXHJcbiAgICAgICAgLm9wdGlvbmFsKClcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlByb3ZpZGUgLyBTZWxlY3QgYSB2YWxpZCBkYXRhXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodikgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IE1ha2VNb2RlbC5maW5kQnlJZCh2KTtcclxuICAgICAgICAgICAgICAgIGlmICghcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGEgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGRhdGEgZG9lcyBub3QgZXhpdC4gUGxlYXNlIGNoZWNrIG9yIHJlZnJlc2hcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnbmFtZScpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ25hbWUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmlzU3RyaW5nKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ25hbWUnIGZpZWxkIGlzIG5vdCB2YWxpZFwiKSxcclxuXHJcblxyXG4gICAgY2hlY2soJ2tleScpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ2tleScgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAuaXNTbHVnKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ2tleScgZmllbGQgaXMgbm90IHZhbGlkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUsIHsgcmVxIH0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBNYWtlTW9kZWwuZmluZE9uZSh7IGlzRGVsZXRlZDogZmFsc2UsIGtleTogdmFsdWUgfSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuX2lkICE9IGJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgbWFrZSBhbHJlYWR5IGV4aXN0IHdpdGggdGhpcyBrZXlcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIG1ha2UgYWxyZWFkeSBleGlzdCB3aXRoIHRoaXMga2V5XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ2lzQWN0aXZlJykuXHJcbiAgICAgICAgbm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnYWN0aXZlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC50b0Jvb2xlYW4oMSA/IHRydWUgOiBmYWxzZSksXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgTWFrZU1vZGVsVmFsaWRhdGlvbiA9IFtcclxuXHJcbiAgICBjaGVjaygnX2lkJylcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiUHJvdmlkZSAvIFNlbGVjdCBhIHZhbGlkIGRhdGFcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgTWFrZU1vZGVsTW9kZWwuZmluZEJ5SWQodik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBkYXRhIGRvZXMgbm90IGV4aXQuIFBsZWFzZSBjaGVjayBvciByZWZyZXNoXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ21ha2UnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiJ01ha2UnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IE1ha2VNb2RlbC5maW5kQnlJZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGEgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInTWFrZScgZmllbGQgaXMgbm90IHZhbGlkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ25hbWUnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICduYW1lJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc1N0cmluZygpLndpdGhNZXNzYWdlKFwiVGhlICduYW1lJyBmaWVsZCBpcyBub3QgdmFsaWRcIiksXHJcblxyXG5cclxuICAgIGNoZWNrKCdrZXknKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdrZXknIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmlzU2x1ZygpLndpdGhNZXNzYWdlKFwiVGhlICdrZXknIGZpZWxkIGlzIG5vdCB2YWxpZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlLCB7IHJlcSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSByZXEuYm9keTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgTWFrZU1vZGVsTW9kZWwuZmluZE9uZSh7IGlzRGVsZXRlZDogZmFsc2UsIGtleTogdmFsdWUgfSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuX2lkICE9IGJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgbWFrZSBtb2RlbCBhbHJlYWR5IGV4aXN0IHdpdGggdGhpcyBrZXlcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIG1ha2UgbW9kZWwgYWxyZWFkeSBleGlzdCB3aXRoIHRoaXMga2V5XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ2lzQWN0aXZlJykuXHJcbiAgICAgICAgbm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnYWN0aXZlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC50b0Jvb2xlYW4oMSA/IHRydWUgOiBmYWxzZSksXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgdmVoaWNsZUNhdGVnb3J5VmFsaWRhdGlvbiA9IFtcclxuXHJcbiAgICBjaGVjaygnX2lkJylcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiUHJvdmlkZSAvIFNlbGVjdCBhIHZhbGlkIGRhdGFcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgVmVoaWNsZUNhdGVnb3J5TW9kZWwuZmluZEJ5SWQodik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBkYXRhIGRvZXMgbm90IGV4aXQuIFBsZWFzZSBjaGVjayBvciByZWZyZXNoXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ3NlcnZpY2VUeXBlJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnU2VydmljZSBUeXBlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlLCB7IHJlcSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFNlcnZpY2VUeXBlTW9kZWwuZmluZEJ5SWQodmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzZXJ2aWNlIHR5cGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnbmFtZScpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ25hbWUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmlzU3RyaW5nKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ25hbWUnIGZpZWxkIGlzIG5vdCB2YWxpZFwiKSxcclxuXHJcblxyXG4gICAgY2hlY2soJ3NsdWcnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdzbHVnJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc1NsdWcoKS53aXRoTWVzc2FnZShcIlRoZSAnc2x1ZycgZmllbGQgaXMgbm90IHZhbGlkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUsIHsgcmVxIH0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBWZWhpY2xlQ2F0ZWdvcnlNb2RlbC5maW5kT25lKHsgaXNEZWxldGVkOiBmYWxzZSwgc2x1ZzogdmFsdWUgfSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuX2lkICE9IGJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgY2F0ZWdvcnkgYWxyZWFkeSBleGlzdCB3aXRoIHRoaXMgc2x1Z1wiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgY2F0ZWdvcnkgYWxyZWFkeSBleGlzdCB3aXRoIHRoaXMgc2x1Z1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCdwaG90bycpXHJcbiAgICAgICAgLmN1c3RvbSgodiwgeyByZXEgfSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlcS5ib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXEuYm9keS5waG90bykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSAnUGhvdG8nIGZpZWxkIGlzIHJlcXVpcmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9wdGlvbmFsKClcclxuICAgICAgICAubWF0Y2hlcygvZGF0YTppbWFnZVxcL1teO10rO2Jhc2U2NFteXCJdKy8pLndpdGhNZXNzYWdlKFwiUGhvdG8gaXMgbm90IGFuIGltYWdlXCIpLFxyXG5cclxuXHJcbiAgICBjaGVjaygnaXNBY3RpdmUnKS5cclxuICAgICAgICBub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdhY3RpdmUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLnRvQm9vbGVhbigxID8gdHJ1ZSA6IGZhbHNlKSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB2ZWhpY2xlVmFsaWRhdGlvbiA9IFtcclxuXHJcbiAgICBjaGVjaygnX2lkJylcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiUHJvdmlkZSAvIFNlbGVjdCBhIHZhbGlkIGRhdGFcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgVmVoaWNsZU1vZGVsLmZpbmRCeUlkKHYpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgZGF0YSBkb2VzIG5vdCBleGl0LiBQbGVhc2UgY2hlY2sgb3IgcmVmcmVzaFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCd2ZWhpY2xlSWQnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdWZWhpY2xlIElEJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlLCB7IHJlcSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSByZXEuYm9keTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgVmVoaWNsZU1vZGVsLmZpbmRPbmUoeyB2ZWhpY2xlSWQ6IHZhbHVlIH0pO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Ll9pZCAhPSBib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHZlaGljbGUgYWxyZWFkeSBleGlzdCB3aXRoIHRoaXMgVmVoaWNsZSBJRFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgdmVoaWNsZSBhbHJlYWR5IGV4aXN0IHdpdGggdGhpcyBWZWhpY2xlIElEXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ3NlcnZpY2VUeXBlJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnU2VydmljZSBUeXBlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgU2VydmljZVR5cGVNb2RlbC5maW5kQnlJZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGEgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTZXJ2aWNlIFR5cGUgaXMgbm90IHZhbGlkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ3JpZGVUeXBlcycpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ1JpZGUgVHlwZScgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAuaXNBcnJheSgpLndpdGhNZXNzYWdlKFwiUmlkZSBUeXBlIGlzIG5vdCB2YWxpZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZT8uZm9yRWFjaChhc3luYyh2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgUmlkZVR5cGVNb2RlbC5maW5kQnlJZCh2KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUmlkZSBUeXBlIGlzIG5vdCB2YWxpZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCd2ZWhpY2xlQ2F0ZWdvcnknKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdWZWhpY2xlIENhdGVnb3J5JyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBWZWhpY2xlQ2F0ZWdvcnlNb2RlbC5maW5kQnlJZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGEgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJWZWhpY2xlIENhdGVnb3J5IGlzIG5vdCB2YWxpZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCdtYWtlJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnTWFrZScgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgTWFrZU1vZGVsLmZpbmRCeUlkKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ha2UgaXMgbm90IHZhbGlkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ21vZGVsJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnTW9kZWwnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IE1ha2VNb2RlbE1vZGVsLmZpbmRCeUlkKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1vZGVsIGlzIG5vdCB2YWxpZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCdjb2xvcicpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ0NvbG9yJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBDb2xvck1vZGVsLmZpbmRCeUlkKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbG9yIGlzIG5vdCB2YWxpZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCdtYW51ZmFjdHVyaW5nWWVhcicpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ01hbnVmYWN0dXJpbmcgWWVhcicgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAubWF0Y2hlcygvXlswLTldezR9JC8pLndpdGhNZXNzYWdlKFwiVGhlICdNYW51ZmFjdHVyaW5nIFllYXInIGZpZWxkIGlzIG5vdCB2YWxpZFwiKSxcclxuXHJcbiAgICBjaGVjaygnbmFtZScpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ25hbWUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmlzU3RyaW5nKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ25hbWUnIGZpZWxkIGlzIG5vdCB2YWxpZFwiKSxcclxuXHJcbiAgICBjaGVjaygndmVoaWNsZU51bWJlcicpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ1ZlaGljbGUgTnVtYmVyJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc1N0cmluZygpLndpdGhNZXNzYWdlKFwiVGhlICdWZWhpY2xlIE51bWJlcicgZmllbGQgaXMgbm90IHZhbGlkXCIpLFxyXG5cclxuICAgIGNoZWNrKCdhdmFpbGFibGVTZWF0cycpXHJcbiAgICAgICAgLm9wdGlvbmFsKClcclxuICAgICAgICAuaXNOdW1lcmljKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ0F2YWlsYWJsZSBTZWF0cycgZmllbGQgaXMgbXVzdCBiZSBhIG51bWJlclwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlLCB7cmVxfSkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgU2VydmljZVR5cGUgPSBhd2FpdCBTZXJ2aWNlVHlwZU1vZGVsLmZpbmRCeUlkKHJlcS5ib2R5Py5TZXJ2aWNlVHlwZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoU2VydmljZVR5cGU/LmtleSA9PT0gJ3RheGknICYmICF2YWx1ZT8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSAnQXZhaWxhYmxlIFNlYXRzJyBmaWVsZCBpcyByZXF1aXJlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCdhdmFpbGFibGVDYXBhY2l0eScpXHJcbiAgICAgICAgLm9wdGlvbmFsKClcclxuICAgICAgICAuaXNOdW1lcmljKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ0F2YWlsYWJsZSBDYXBhY2l0eScgZmllbGQgaXMgbXVzdCBiZSBhIG51bWJlclwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlLCB7cmVxfSkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgU2VydmljZVR5cGUgPSBhd2FpdCBTZXJ2aWNlVHlwZU1vZGVsLmZpbmRCeUlkKHJlcS5ib2R5Py5TZXJ2aWNlVHlwZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoU2VydmljZVR5cGU/LmtleSA9PT0gJ2NhcmdvJyAmJiAhdmFsdWU/Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGEgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgJ0F2YWlsYWJsZSBDYXBhY2l0eScgZmllbGQgaXMgcmVxdWlyZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnc3RhdGUnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdTdGF0ZScgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAvLyAuaXNTdHJpbmcoKS53aXRoTWVzc2FnZShcIlRoZSAnU3RhdGUnIGZpZWxkIGlzIG5vdCB2YWxpZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBTdGF0ZU1vZGVsLmZpbmRCeUlkKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN0YXRlIGlzIG5vdCB2YWxpZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCdkaXN0cmljdCcpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ0Rpc3RyaWN0JyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc1N0cmluZygpLndpdGhNZXNzYWdlKFwiVGhlICdEaXN0cmljdCcgZmllbGQgaXMgbm90IHZhbGlkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IERpc3RyaWN0TW9kZWwuZmluZEJ5SWQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGlzdHJpY3QgaXMgbm90IHZhbGlkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ3RhbHVrJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnVGFsdWsnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmlzU3RyaW5nKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ1RhbHVrJyBmaWVsZCBpcyBub3QgdmFsaWRcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgVGFsdWtNb2RlbC5maW5kQnlJZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGEgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUYWx1ayBpcyBub3QgdmFsaWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygncHJpbWFyeVBob3RvJylcclxuICAgICAgICAuY3VzdG9tKCh2LCB7IHJlcSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcmVxLmJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlcS5ib2R5LnByaW1hcnlQaG90bykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSAnUHJpbWFyeSBQaG90bycgZmllbGQgaXMgcmVxdWlyZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5tYXRjaGVzKC9kYXRhOmltYWdlXFwvW147XSs7YmFzZTY0W15cIl0rLykud2l0aE1lc3NhZ2UoXCJQcmltYXJ5IFBob3RvIGlzIG5vdCBhbiBpbWFnZVwiKSxcclxuXHJcbiAgICBjaGVjaygnb3RoZXJQaG90b3MnKVxyXG4gICAgICAgIC5vcHRpb25hbCgpXHJcbiAgICAgICAgLmlzQXJyYXkoKS53aXRoTWVzc2FnZShcIk90aGVyIHBob3RvIGZpZWxkIGlzIG5vdCB2YWxpZFwiKVxyXG4gICAgICAgIC5jdXN0b20oKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB2YWx1ZT8uZmluZCh2PT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIXYubWF0Y2goL2RhdGE6aW1hZ2VcXC9bXjtdKztiYXNlNjRbXlwiXSsvKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYodGVtcD8ubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk90aGVyIFBob3RvIGlzIG5vdCBhbiBpbWFnZVwiKTtcclxuICAgICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygncmVnaXN0cmF0aW9uTnVtYmVyJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnUmVnaXN0cmF0aW9uIE51bWJlcicgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAuaXNTdHJpbmcoKS53aXRoTWVzc2FnZShcIlRoZSAnUmVnaXN0cmF0aW9uIE51bWJlcicgZmllbGQgaXMgbm90IHZhbGlkXCIpLFxyXG5cclxuICAgIGNoZWNrKCdyZWdpc3RyYXRpb25FeHBpcnlEYXRlJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnUmVnaXN0cmF0aW9uIEV4cGlyeSBEYXRlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5tYXRjaGVzKC9eXFxkezR9LSgwWzEtOV18MVswLTJdKS0oMFsxLTldfFsxMl1bMC05XXwzWzAxXSkkLykud2l0aE1lc3NhZ2UoXCJUaGUgJ1JlZ2lzdHJhdGlvbiBFeHBpcnkgRGF0ZScgZmllbGQgaXMgbm90IHZhbGlkXCIpLFxyXG5cclxuICAgIGNoZWNrKCdyZWdpc3RyYXRpb25QaG90bycpXHJcbiAgICAgICAgLmN1c3RvbSgodiwgeyByZXEgfSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlcS5ib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXEuYm9keS5yZWdpc3RyYXRpb25QaG90bykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSAnUmVnaXN0cmF0aW9uIFBob3RvJyBmaWVsZCBpcyByZXF1aXJlZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vcHRpb25hbCgpXHJcbiAgICAgICAgLm1hdGNoZXMoL2RhdGE6aW1hZ2VcXC9bXjtdKztiYXNlNjRbXlwiXSsvKS53aXRoTWVzc2FnZShcIlJlZ2lzdHJhdGlvbiBQaG90byBpcyBub3QgYW4gaW1hZ2VcIiksXHJcblxyXG4gICAgXHJcbiAgICAgICAgXHJcbiAgICBjaGVjaygnaW5zdXJhbmNlTnVtYmVyJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnSW5zdXJhbmNlIE51bWJlcicgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAuaXNTdHJpbmcoKS53aXRoTWVzc2FnZShcIlRoZSAnSW5zdXJhbmNlIE51bWJlcicgZmllbGQgaXMgbm90IHZhbGlkXCIpLFxyXG5cclxuICAgIGNoZWNrKCdpbnN1cmFuY2VFeHBpcnlEYXRlJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnSW5zdXJhbmNlIEV4cGlyYXJ5IERhdGUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLm1hdGNoZXMoL15cXGR7NH0tKDBbMS05XXwxWzAtMl0pLSgwWzEtOV18WzEyXVswLTldfDNbMDFdKSQvKS53aXRoTWVzc2FnZShcIlRoZSAnSW5zdXJhbmNlIEV4cGlyYXJ5IERhdGUnIGZpZWxkIGlzIG5vdCB2YWxpZFwiKSxcclxuXHJcbiAgICBjaGVjaygnaW5zdXJhbmNlUGhvdG8nKVxyXG4gICAgICAgIC5jdXN0b20oKHYsIHsgcmVxIH0pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyZXEuYm9keS5faWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVxLmJvZHkuaW5zdXJhbmNlUGhvdG8pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgJ0luc3VyYW5jZSBQaG90bycgZmllbGQgaXMgcmVxdWlyZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5tYXRjaGVzKC9kYXRhOmltYWdlXFwvW147XSs7YmFzZTY0W15cIl0rLykud2l0aE1lc3NhZ2UoXCJJbnN1cmFuY2UgUGhvdG8gaXMgbm90IGFuIGltYWdlXCIpLFxyXG5cclxuXHJcblxyXG4gICAgY2hlY2soJ3Blcm1pdE51bWJlcicpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ1Blcm1pdCBOdW1iZXInIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmlzU3RyaW5nKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ1Blcm1pdCBOdW1iZXInIGZpZWxkIGlzIG5vdCB2YWxpZFwiKSxcclxuXHJcbiAgICBjaGVjaygncGVybWl0RXhwaXJ5RGF0ZScpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ1Blcm1pdCBFeHBpcmFyeSBEYXRlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5tYXRjaGVzKC9eXFxkezR9LSgwWzEtOV18MVswLTJdKS0oMFsxLTldfFsxMl1bMC05XXwzWzAxXSkkLykud2l0aE1lc3NhZ2UoXCJUaGUgJ1Blcm1pdCBFeHBpcmFyeSBEYXRlJyBmaWVsZCBpcyBub3QgdmFsaWRcIiksXHJcblxyXG4gICAgY2hlY2soJ3Blcm1pdFBob3RvJylcclxuICAgICAgICAuY3VzdG9tKCh2LCB7IHJlcSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcmVxLmJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlcS5ib2R5LnBlcm1pdFBob3RvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlICdQZXJtaXQgUGhvdG8nIGZpZWxkIGlzIHJlcXVpcmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9wdGlvbmFsKClcclxuICAgICAgICAubWF0Y2hlcygvZGF0YTppbWFnZVxcL1teO10rO2Jhc2U2NFteXCJdKy8pLndpdGhNZXNzYWdlKFwiUGVybWl0IFBob3RvIGlzIG5vdCBhbiBpbWFnZVwiKSxcclxuXHJcblxyXG5cclxuICAgIGNoZWNrKCdwb2xsdXRpb25OdW1iZXInKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdQb2xsdXRpb24gTnVtYmVyJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc1N0cmluZygpLndpdGhNZXNzYWdlKFwiVGhlICdQb2xsdXRpb24gTnVtYmVyJyBmaWVsZCBpcyBub3QgdmFsaWRcIiksXHJcblxyXG4gICAgY2hlY2soJ3BvbGx1dGlvbkV4cGlyeURhdGUnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdQb2xsdXRpb24gRXhwaXJhcnkgRGF0ZScgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAubWF0Y2hlcygvXlxcZHs0fS0oMFsxLTldfDFbMC0yXSktKDBbMS05XXxbMTJdWzAtOV18M1swMV0pJC8pLndpdGhNZXNzYWdlKFwiVGhlICdQb2xsdXRpb24gRXhwaXJhcnkgRGF0ZScgZmllbGQgaXMgbm90IHZhbGlkXCIpLFxyXG5cclxuICAgIGNoZWNrKCdwb2xsdXRpb25QaG90bycpXHJcbiAgICAgICAgLmN1c3RvbSgodiwgeyByZXEgfSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlcS5ib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXEuYm9keS5wb2xsdXRpb25QaG90bykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSAnUG9sbHV0aW9uIFBob3RvJyBmaWVsZCBpcyByZXF1aXJlZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vcHRpb25hbCgpXHJcbiAgICAgICAgLm1hdGNoZXMoL2RhdGE6aW1hZ2VcXC9bXjtdKztiYXNlNjRbXlwiXSsvKS53aXRoTWVzc2FnZShcIlBvbGx1dGlvbiBQaG90byBpcyBub3QgYW4gaW1hZ2VcIiksXHJcblxyXG5cclxuXHJcblxyXG4gICAgY2hlY2soJ2lzQWN0aXZlJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnYWN0aXZlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC50b0Jvb2xlYW4oMSA/IHRydWUgOiBmYWxzZSksXHJcbl07XHJcbiJdfQ==