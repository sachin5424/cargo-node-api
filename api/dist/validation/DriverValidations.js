"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.walletValidationAdmin = exports.driverValidation = exports.driverResetPasswordValidation = exports.driverLoginValidation = void 0;

var _import = require("../settings/import");

var _driver = _interopRequireDefault(require("../data-base/models/driver"));

var _state = _interopRequireDefault(require("../data-base/models/state"));

var _district = _interopRequireDefault(require("../data-base/models/district"));

var _taluk = _interopRequireDefault(require("../data-base/models/taluk"));

var _helper = require("../utls/_helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const driverLoginValidation = [(0, _import.check)('email').notEmpty().withMessage("Email is required").isEmail().withMessage("Provide a valid email").custom(async v => {
  try {
    const r = await _driver.default.findOne({
      email: v,
      isDeleted: false
    });

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("Email is not registered");
  }
}), (0, _import.check)('password').notEmpty().withMessage("Password is required")];
exports.driverLoginValidation = driverLoginValidation;
const driverValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async (v, {
  req
}) => {
  try {
    const permissionFilter = cuser.type == 'vehicleOwner' ? {
      owner: cuser._id
    } : _objectSpread({}, (0, _helper.getAdminFilter)());

    const search = _objectSpread({
      _id: v,
      isDeleted: false
    }, permissionFilter);

    (0, _helper.clearSearch)(search);
    const r = await _driver.default.findOne(search);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('firstName').notEmpty().withMessage("The 'First Name' field is required").isString().withMessage("The 'First Name' field is not valid"), (0, _import.check)('lastName').notEmpty().withMessage("The 'Last Name' field is required").isString().withMessage("The 'Last Name' field is not valid"), (0, _import.check)('driverId').notEmpty().withMessage("The 'Driver ID' field is required").custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _driver.default.findOne({
    driverId: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A driver already exist with this Driver ID");
      }
    } else {
      throw new Error("A driver already exist with this Driver ID");
    }
  }
}), (0, _import.check)('phoneNo').notEmpty().withMessage("The 'Phone Number' field is required").matches(/^[3-9]{1}[0-9]{9}$/).withMessage("The 'Phone Number' field is not valid").custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _driver.default.findOne({
    phoneNo: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A driver already exist with this phone number");
      }
    } else {
      throw new Error("A driver already exist with this phone number");
    }
  }
}), (0, _import.check)('email').notEmpty().withMessage("The 'Email' field is required").isEmail().withMessage("The 'Email' field is not valid").custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _driver.default.findOne({
    email: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A driver already exist with this email");
      }
    } else {
      throw new Error("A driver already exist with this email");
    }
  }
}), (0, _import.check)('password').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.password) {
      throw new Error("The 'Password' field is required");
    }
  }

  return true;
}), (0, _import.check)('dob').notEmpty().withMessage("The 'Date of Birth' field is required").matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Date of Birth' field is not valid"), (0, _import.check)('photo').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.photo) {
      throw new Error("The 'Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Photo is not an image"), (0, _import.check)('drivingLicenceNumber').notEmpty().withMessage("The 'Driving Licence Number' field is required").isString().withMessage("The 'Driving Licence Number' field is must be a valid") // .matches(/^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/).withMessage("'Driving Licence Number' is not valid")
.custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _driver.default.findOne({
    drivingLicenceNumber: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A driver already exist with this licence number");
      }
    } else {
      throw new Error("A driver already exist with this licence number");
    }
  }
}), (0, _import.check)('drivingLicenceNumberExpiryDate').notEmpty().withMessage("The 'Driving Licence Expiry Date' field is required").matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Driving Licence Expiry Date' field is not valid"), (0, _import.check)('drivingLicencePhoto').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.drivingLicencePhoto) {
      throw new Error("The 'Driving Licence Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Driving Licence Photo is not an image"), (0, _import.check)('adharNo').notEmpty().withMessage("The 'Adhar Number' field is required") // .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/).withMessage("The 'Adhar Number' field is not valid")
.custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _driver.default.findOne({
    adharNo: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A driver already exist with this adhar number");
      }
    } else {
      throw new Error("A driver already exist with this adhar number");
    }
  }
}), (0, _import.check)('adharCardPhoto').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.adharCardPhoto) {
      throw new Error("The 'Adhar Card Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Adhar Card Photo is not an image"), (0, _import.check)('panNo').notEmpty().withMessage("The 'Pan Number' field is required") // .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage("The 'Pan Number' field is not valid")
.custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _driver.default.findOne({
    panNo: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A driver already exist with this pan number");
      }
    } else {
      throw new Error("A driver already exist with this pan number");
    }
  }
}), (0, _import.check)('panCardPhoto').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.panCardPhoto) {
      throw new Error("The 'Pan Card Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Pan Card Photo is not an image"), (0, _import.check)('badgeNo').notEmpty().withMessage("The 'Badge Number' field is required") // .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage("The 'Badge Number' field is not valid")
.custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _driver.default.findOne({
    badgeNo: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A driver already exist with this badge number");
      }
    } else {
      throw new Error("A driver already exist with this badge number");
    }
  }
}), (0, _import.check)('badgePhoto').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.badgePhoto) {
      throw new Error("The 'Badge Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Badge Photo is not an image"), (0, _import.check)('address').notEmpty().withMessage("The 'Address' field is required").isString().withMessage("The 'Address' field is not valid"), (0, _import.check)('state').notEmpty().withMessage("The 'State' field is required").isString().withMessage("The 'State' field is not valid").custom(async value => {
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
}), (0, _import.check)('zipcode').notEmpty().withMessage("The 'Zipcode' field is required").matches(/^[1-9]{1}[0-9]{5}$/).withMessage("The 'Zipcode' field is not valid"), (0, _import.check)('isApproved').notEmpty().withMessage("The 'Approval Status' field is required").toBoolean(1 ? true : false), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.driverValidation = driverValidation;
const walletValidationAdmin = [(0, _import.check)('transactionType').notEmpty().withMessage("The 'Transaction Type' field is required").isIn(['debit', 'credit']).withMessage('This transaction type is not valid'), (0, _import.check)('amount').notEmpty().withMessage("The 'Amount' field is required").isNumeric({
  min: 0
}).withMessage("The 'Amount' field must be numeric")];
exports.walletValidationAdmin = walletValidationAdmin;
const driverResetPasswordValidation = [(0, _import.check)('password').notEmpty().withMessage("Fill the password"), (0, _import.check)('confirmPassword').notEmpty().withMessage("Fill the confirm password").custom(async (value, {
  req
}) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword) {
    throw new Error("Both password does not match");
  }
})];
exports.driverResetPasswordValidation = driverResetPasswordValidation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0aW9uL0RyaXZlclZhbGlkYXRpb25zLmpzIl0sIm5hbWVzIjpbImRyaXZlckxvZ2luVmFsaWRhdGlvbiIsIm5vdEVtcHR5Iiwid2l0aE1lc3NhZ2UiLCJpc0VtYWlsIiwiY3VzdG9tIiwidiIsInIiLCJEcml2ZXJNb2RlbCIsImZpbmRPbmUiLCJlbWFpbCIsImlzRGVsZXRlZCIsIkVycm9yIiwiZSIsImRyaXZlclZhbGlkYXRpb24iLCJvcHRpb25hbCIsInJlcSIsInBlcm1pc3Npb25GaWx0ZXIiLCJjdXNlciIsInR5cGUiLCJvd25lciIsIl9pZCIsInNlYXJjaCIsImlzU3RyaW5nIiwidmFsdWUiLCJib2R5IiwicmVzdWx0IiwiZHJpdmVySWQiLCJtYXRjaGVzIiwicGhvbmVObyIsInBhc3N3b3JkIiwicGhvdG8iLCJkcml2aW5nTGljZW5jZU51bWJlciIsImRyaXZpbmdMaWNlbmNlUGhvdG8iLCJhZGhhck5vIiwiYWRoYXJDYXJkUGhvdG8iLCJwYW5ObyIsInBhbkNhcmRQaG90byIsImJhZGdlTm8iLCJiYWRnZVBob3RvIiwiU3RhdGVNb2RlbCIsImZpbmRCeUlkIiwiRGlzdHJpY3RNb2RlbCIsIlRhbHVrTW9kZWwiLCJ0b0Jvb2xlYW4iLCJ3YWxsZXRWYWxpZGF0aW9uQWRtaW4iLCJpc0luIiwiaXNOdW1lcmljIiwibWluIiwiZHJpdmVyUmVzZXRQYXNzd29yZFZhbGlkYXRpb24iLCJjb25maXJtUGFzc3dvcmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUdPLE1BQU1BLHFCQUFxQixHQUFHLENBQ2pDLG1CQUFNLE9BQU4sRUFDS0MsUUFETCxHQUNnQkMsV0FEaEIsQ0FDNEIsbUJBRDVCLEVBRUtDLE9BRkwsR0FFZUQsV0FGZixDQUUyQix1QkFGM0IsRUFHS0UsTUFITCxDQUdZLE1BQU9DLENBQVAsSUFBYTtBQUNqQixNQUFJO0FBQ0EsVUFBTUMs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QStSNUIsbUJBQU0sVUFBTixFQUNJMUMsUUFESixHQUNlQyxXQURmLENBQzJCLGdDQUQzQixFQUVLeUMsU0FGTCxDQUVlLElBQUksSUFBSixHQUFXLEtBRjFCLENBL1I0QixDQUF6Qjs7QUFvU0EsTUFBTUMscUJBQXFCLEdBQUcsQ0FFakMsbUJBQU0saUJBQU4sRUFDSzNDLFFBREwsR0FDZ0JDLFdBRGhCLENBQzRCLDBDQUQ1QixFQUVLMkMsSUFGTCxDQUVVLENBQUMsT0FBRCxFQUFVLFFBQVYsQ0FGVixFQUUrQjNDLFdBRi9CLENBRTJDLG9DQUYzQyxDQUZpQyxFQU1qQyxtQkFBTSxRQUFOLEVBQ0tELFFBREwsR0FDZ0JDLFdBRGhCLENBQzRCLGdDQUQ1QixFQUVLNEMsU0FGTCxDQUVlO0FBQUVDLEVBQUFBLEdBQUcsRUFBQztBQUFOLENBRmYsRUFFeUI3QyxXQUZ6QixDQUVxQyxvQ0FGckMsQ0FOaUMsQ0FBOUI7O0FBV0EsTUFBTThDLDZCQUE2QixHQUFHLENBQ3pDLG1CQUFNLFVBQU4sRUFDSy9DLFFBREwsR0FDZ0JDLFdBRGhCLENBQzRCLG1CQUQ1QixDQUR5QyxFQUd6QyxtQkFBTSxpQkFBTixFQUNLRCxRQURMLEdBQ2dCQyxXQURoQixDQUM0QiwyQkFENUIsRUFFS0UsTUFGTCxDQUVZLE9BQU9tQixLQUFQLEVBQWM7QUFBRVIsRUFBQUE7QUFBRixDQUFkLEtBQTBCO0FBQzlCLFFBQU1jLFFBQVEsR0FBR2QsR0FBRyxDQUFDUyxJQUFKLENBQVNLLFFBQTFCO0FBQ0EsUUFBTW9CLGVBQWUsR0FBR2xDLEdBQUcsQ0FBQ1MsSUFBSixDQUFTeUIsZUFBakM7O0FBRUEsTUFBR3BCLFFBQVEsS0FBS29CLGVBQWhCLEVBQWdDO0FBQzVCLFVBQU0sSUFBSXRDLEtBQUosQ0FBVSw4QkFBVixDQUFOO0FBQ0g7QUFDSixDQVRMLENBSHlDLENBQXRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2sgfSBmcm9tICcuLi9zZXR0aW5ncy9pbXBvcnQnO1xyXG5pbXBvcnQgRHJpdmVyTW9kZWwgZnJvbSAnLi4vZGF0YS1iYXNlL21vZGVscy9kcml2ZXInO1xyXG5pbXBvcnQgU3RhdGVNb2RlbCBmcm9tICcuLi9kYXRhLWJhc2UvbW9kZWxzL3N0YXRlJztcclxuaW1wb3J0IERpc3RyaWN0TW9kZWwgZnJvbSAnLi4vZGF0YS1iYXNlL21vZGVscy9kaXN0cmljdCc7XHJcbmltcG9ydCBUYWx1a01vZGVsIGZyb20gJy4uL2RhdGEtYmFzZS9tb2RlbHMvdGFsdWsnO1xyXG5pbXBvcnQgeyBnZXRBZG1pbkZpbHRlciwgY2xlYXJTZWFyY2ggfSBmcm9tICcuLi91dGxzL19oZWxwZXInO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBkcml2ZXJMb2dpblZhbGlkYXRpb24gPSBbXHJcbiAgICBjaGVjaygnZW1haWwnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiRW1haWwgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAuaXNFbWFpbCgpLndpdGhNZXNzYWdlKFwiUHJvdmlkZSBhIHZhbGlkIGVtYWlsXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodikgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IERyaXZlck1vZGVsLmZpbmRPbmUoe2VtYWlsOiB2LCBpc0RlbGV0ZWQ6IGZhbHNlfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW1haWwgaXMgbm90IHJlZ2lzdGVyZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygncGFzc3dvcmQnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiUGFzc3dvcmQgaXMgcmVxdWlyZWRcIiksXHJcblxyXG5dO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBkcml2ZXJWYWxpZGF0aW9uID0gW1xyXG5cclxuICAgIGNoZWNrKCdfaWQnKVxyXG4gICAgICAgIC5vcHRpb25hbCgpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJQcm92aWRlIC8gU2VsZWN0IGEgdmFsaWQgZGF0YVwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHYsIHtyZXF9KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwZXJtaXNzaW9uRmlsdGVyID0gY3VzZXIudHlwZSA9PSAndmVoaWNsZU93bmVyJyA/IHsgb3duZXI6IGN1c2VyLl9pZCB9IDogeyAuLi5nZXRBZG1pbkZpbHRlcigpIH07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWFyY2ggPSB7IF9pZDogdiwgaXNEZWxldGVkOiBmYWxzZSwgLi4ucGVybWlzc2lvbkZpbHRlciB9O1xyXG4gICAgICAgICAgICAgICAgY2xlYXJTZWFyY2goc2VhcmNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgRHJpdmVyTW9kZWwuZmluZE9uZShzZWFyY2gpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgZGF0YSBkb2VzIG5vdCBleGl0LiBQbGVhc2UgY2hlY2sgb3IgcmVmcmVzaFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCdmaXJzdE5hbWUnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdGaXJzdCBOYW1lJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc1N0cmluZygpLndpdGhNZXNzYWdlKFwiVGhlICdGaXJzdCBOYW1lJyBmaWVsZCBpcyBub3QgdmFsaWRcIiksXHJcblxyXG4gICAgY2hlY2soJ2xhc3ROYW1lJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnTGFzdCBOYW1lJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc1N0cmluZygpLndpdGhNZXNzYWdlKFwiVGhlICdMYXN0IE5hbWUnIGZpZWxkIGlzIG5vdCB2YWxpZFwiKSxcclxuXHJcbiAgICBjaGVjaygnZHJpdmVySWQnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdEcml2ZXIgSUQnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUsIHsgcmVxIH0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBEcml2ZXJNb2RlbC5maW5kT25lKHsgZHJpdmVySWQ6IHZhbHVlIH0pO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Ll9pZCAhPSBib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGRyaXZlciBhbHJlYWR5IGV4aXN0IHdpdGggdGhpcyBEcml2ZXIgSURcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGRyaXZlciBhbHJlYWR5IGV4aXN0IHdpdGggdGhpcyBEcml2ZXIgSURcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygncGhvbmVObycpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ1Bob25lIE51bWJlcicgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAubWF0Y2hlcygvXlszLTldezF9WzAtOV17OX0kLykud2l0aE1lc3NhZ2UoXCJUaGUgJ1Bob25lIE51bWJlcicgZmllbGQgaXMgbm90IHZhbGlkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUsIHsgcmVxIH0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBEcml2ZXJNb2RlbC5maW5kT25lKHsgcGhvbmVObzogdmFsdWUgfSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuX2lkICE9IGJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgZHJpdmVyIGFscmVhZHkgZXhpc3Qgd2l0aCB0aGlzIHBob25lIG51bWJlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgZHJpdmVyIGFscmVhZHkgZXhpc3Qgd2l0aCB0aGlzIHBob25lIG51bWJlclwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCdlbWFpbCcpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ0VtYWlsJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc0VtYWlsKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ0VtYWlsJyBmaWVsZCBpcyBub3QgdmFsaWRcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2YWx1ZSwgeyByZXEgfSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBib2R5ID0gcmVxLmJvZHk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IERyaXZlck1vZGVsLmZpbmRPbmUoeyBlbWFpbDogdmFsdWUgfSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuX2lkICE9IGJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgZHJpdmVyIGFscmVhZHkgZXhpc3Qgd2l0aCB0aGlzIGVtYWlsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQSBkcml2ZXIgYWxyZWFkeSBleGlzdCB3aXRoIHRoaXMgZW1haWxcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygncGFzc3dvcmQnKVxyXG4gICAgICAgIC5jdXN0b20oKHYsIHsgcmVxIH0pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyZXEuYm9keS5faWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVxLmJvZHkucGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgJ1Bhc3N3b3JkJyBmaWVsZCBpcyByZXF1aXJlZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnZG9iJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnRGF0ZSBvZiBCaXJ0aCcgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAubWF0Y2hlcygvXlxcZHs0fS0oMFsxLTldfDFbMC0yXSktKDBbMS05XXxbMTJdWzAtOV18M1swMV0pJC8pLndpdGhNZXNzYWdlKFwiVGhlICdEYXRlIG9mIEJpcnRoJyBmaWVsZCBpcyBub3QgdmFsaWRcIiksXHJcblxyXG4gICAgY2hlY2soJ3Bob3RvJylcclxuICAgICAgICAuY3VzdG9tKCh2LCB7IHJlcSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcmVxLmJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlcS5ib2R5LnBob3RvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlICdQaG90bycgZmllbGQgaXMgcmVxdWlyZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5tYXRjaGVzKC9kYXRhOmltYWdlXFwvW147XSs7YmFzZTY0W15cIl0rLykud2l0aE1lc3NhZ2UoXCJQaG90byBpcyBub3QgYW4gaW1hZ2VcIiksXHJcblxyXG4gICAgY2hlY2soJ2RyaXZpbmdMaWNlbmNlTnVtYmVyJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnRHJpdmluZyBMaWNlbmNlIE51bWJlcicgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAuaXNTdHJpbmcoKS53aXRoTWVzc2FnZShcIlRoZSAnRHJpdmluZyBMaWNlbmNlIE51bWJlcicgZmllbGQgaXMgbXVzdCBiZSBhIHZhbGlkXCIpXHJcbiAgICAgICAgLy8gLm1hdGNoZXMoL14oKFtBLVpdezJ9WzAtOV17Mn0pKCApfChbQS1aXXsyfS1bMC05XXsyfSkpKCgxOXwyMClbMC05XVswLTldKVswLTldezd9JC8pLndpdGhNZXNzYWdlKFwiJ0RyaXZpbmcgTGljZW5jZSBOdW1iZXInIGlzIG5vdCB2YWxpZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlLCB7IHJlcSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSByZXEuYm9keTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgRHJpdmVyTW9kZWwuZmluZE9uZSh7IGRyaXZpbmdMaWNlbmNlTnVtYmVyOiB2YWx1ZSB9KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5faWQgIT0gYm9keS5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQSBkcml2ZXIgYWxyZWFkeSBleGlzdCB3aXRoIHRoaXMgbGljZW5jZSBudW1iZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIGRyaXZlciBhbHJlYWR5IGV4aXN0IHdpdGggdGhpcyBsaWNlbmNlIG51bWJlclwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIFxyXG4gICAgY2hlY2soJ2RyaXZpbmdMaWNlbmNlTnVtYmVyRXhwaXJ5RGF0ZScpXHJcbiAgICAgICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdEcml2aW5nIExpY2VuY2UgRXhwaXJ5IERhdGUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgICAgIC5tYXRjaGVzKC9eXFxkezR9LSgwWzEtOV18MVswLTJdKS0oMFsxLTldfFsxMl1bMC05XXwzWzAxXSkkLykud2l0aE1lc3NhZ2UoXCJUaGUgJ0RyaXZpbmcgTGljZW5jZSBFeHBpcnkgRGF0ZScgZmllbGQgaXMgbm90IHZhbGlkXCIpLFxyXG4gICAgXHJcbiAgICBjaGVjaygnZHJpdmluZ0xpY2VuY2VQaG90bycpXHJcbiAgICAgICAgLmN1c3RvbSgodiwgeyByZXEgfSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlcS5ib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXEuYm9keS5kcml2aW5nTGljZW5jZVBob3RvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlICdEcml2aW5nIExpY2VuY2UgUGhvdG8nIGZpZWxkIGlzIHJlcXVpcmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9wdGlvbmFsKClcclxuICAgICAgICAubWF0Y2hlcygvZGF0YTppbWFnZVxcL1teO10rO2Jhc2U2NFteXCJdKy8pLndpdGhNZXNzYWdlKFwiRHJpdmluZyBMaWNlbmNlIFBob3RvIGlzIG5vdCBhbiBpbWFnZVwiKSxcclxuXHJcbiAgICBjaGVjaygnYWRoYXJObycpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ0FkaGFyIE51bWJlcicgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAvLyAubWF0Y2hlcygvXlsyLTldezF9WzAtOV17M31bMC05XXs0fVswLTldezR9JC8pLndpdGhNZXNzYWdlKFwiVGhlICdBZGhhciBOdW1iZXInIGZpZWxkIGlzIG5vdCB2YWxpZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlLCB7IHJlcSB9KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBib2R5ID0gcmVxLmJvZHk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IERyaXZlck1vZGVsLmZpbmRPbmUoeyBhZGhhck5vOiB2YWx1ZSB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuX2lkICE9IGJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgZHJpdmVyIGFscmVhZHkgZXhpc3Qgd2l0aCB0aGlzIGFkaGFyIG51bWJlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgZHJpdmVyIGFscmVhZHkgZXhpc3Qgd2l0aCB0aGlzIGFkaGFyIG51bWJlclwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnYWRoYXJDYXJkUGhvdG8nKVxyXG4gICAgICAgIC5jdXN0b20oKHYsIHsgcmVxIH0pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyZXEuYm9keS5faWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVxLmJvZHkuYWRoYXJDYXJkUGhvdG8pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgJ0FkaGFyIENhcmQgUGhvdG8nIGZpZWxkIGlzIHJlcXVpcmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9wdGlvbmFsKClcclxuICAgICAgICAubWF0Y2hlcygvZGF0YTppbWFnZVxcL1teO10rO2Jhc2U2NFteXCJdKy8pLndpdGhNZXNzYWdlKFwiQWRoYXIgQ2FyZCBQaG90byBpcyBub3QgYW4gaW1hZ2VcIiksXHJcblxyXG4gICAgY2hlY2soJ3Bhbk5vJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnUGFuIE51bWJlcicgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAvLyAubWF0Y2hlcygvW0EtWl17NX1bMC05XXs0fVtBLVpdezF9JC8pLndpdGhNZXNzYWdlKFwiVGhlICdQYW4gTnVtYmVyJyBmaWVsZCBpcyBub3QgdmFsaWRcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2YWx1ZSwgeyByZXEgfSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBEcml2ZXJNb2RlbC5maW5kT25lKHsgcGFuTm86IHZhbHVlIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5faWQgIT0gYm9keS5faWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQSBkcml2ZXIgYWxyZWFkeSBleGlzdCB3aXRoIHRoaXMgcGFuIG51bWJlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgZHJpdmVyIGFscmVhZHkgZXhpc3Qgd2l0aCB0aGlzIHBhbiBudW1iZXJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ3BhbkNhcmRQaG90bycpXHJcbiAgICAgICAgLmN1c3RvbSgodiwgeyByZXEgfSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlcS5ib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXEuYm9keS5wYW5DYXJkUGhvdG8pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgJ1BhbiBDYXJkIFBob3RvJyBmaWVsZCBpcyByZXF1aXJlZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vcHRpb25hbCgpXHJcbiAgICAgICAgLm1hdGNoZXMoL2RhdGE6aW1hZ2VcXC9bXjtdKztiYXNlNjRbXlwiXSsvKS53aXRoTWVzc2FnZShcIlBhbiBDYXJkIFBob3RvIGlzIG5vdCBhbiBpbWFnZVwiKSxcclxuXHJcbiAgICBjaGVjaygnYmFkZ2VObycpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ0JhZGdlIE51bWJlcicgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAvLyAubWF0Y2hlcygvW0EtWl17NX1bMC05XXs0fVtBLVpdezF9JC8pLndpdGhNZXNzYWdlKFwiVGhlICdCYWRnZSBOdW1iZXInIGZpZWxkIGlzIG5vdCB2YWxpZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlLCB7IHJlcSB9KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBib2R5ID0gcmVxLmJvZHk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IERyaXZlck1vZGVsLmZpbmRPbmUoeyBiYWRnZU5vOiB2YWx1ZSB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuX2lkICE9IGJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgZHJpdmVyIGFscmVhZHkgZXhpc3Qgd2l0aCB0aGlzIGJhZGdlIG51bWJlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgZHJpdmVyIGFscmVhZHkgZXhpc3Qgd2l0aCB0aGlzIGJhZGdlIG51bWJlclwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnYmFkZ2VQaG90bycpXHJcbiAgICAgICAgLmN1c3RvbSgodiwgeyByZXEgfSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlcS5ib2R5Ll9pZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXEuYm9keS5iYWRnZVBob3RvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlICdCYWRnZSBQaG90bycgZmllbGQgaXMgcmVxdWlyZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5tYXRjaGVzKC9kYXRhOmltYWdlXFwvW147XSs7YmFzZTY0W15cIl0rLykud2l0aE1lc3NhZ2UoXCJCYWRnZSBQaG90byBpcyBub3QgYW4gaW1hZ2VcIiksXHJcblxyXG4gICAgY2hlY2soJ2FkZHJlc3MnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdBZGRyZXNzJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc1N0cmluZygpLndpdGhNZXNzYWdlKFwiVGhlICdBZGRyZXNzJyBmaWVsZCBpcyBub3QgdmFsaWRcIiksXHJcblxyXG4gICAgY2hlY2soJ3N0YXRlJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnU3RhdGUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmlzU3RyaW5nKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ1N0YXRlJyBmaWVsZCBpcyBub3QgdmFsaWRcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgU3RhdGVNb2RlbC5maW5kQnlJZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGEgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdGF0ZSBpcyBub3QgdmFsaWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnZGlzdHJpY3QnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdEaXN0cmljdCcgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAuaXNTdHJpbmcoKS53aXRoTWVzc2FnZShcIlRoZSAnRGlzdHJpY3QnIGZpZWxkIGlzIG5vdCB2YWxpZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBEaXN0cmljdE1vZGVsLmZpbmRCeUlkKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRpc3RyaWN0IGlzIG5vdCB2YWxpZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCd0YWx1aycpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ1RhbHVrJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc1N0cmluZygpLndpdGhNZXNzYWdlKFwiVGhlICdUYWx1aycgZmllbGQgaXMgbm90IHZhbGlkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFRhbHVrTW9kZWwuZmluZEJ5SWQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGFsdWsgaXMgbm90IHZhbGlkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ3ppcGNvZGUnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdaaXBjb2RlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5tYXRjaGVzKC9eWzEtOV17MX1bMC05XXs1fSQvKS53aXRoTWVzc2FnZShcIlRoZSAnWmlwY29kZScgZmllbGQgaXMgbm90IHZhbGlkXCIpLFxyXG5cclxuICAgIGNoZWNrKCdpc0FwcHJvdmVkJykuXHJcbiAgICAgICAgbm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnQXBwcm92YWwgU3RhdHVzJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC50b0Jvb2xlYW4oMSA/IHRydWUgOiBmYWxzZSksXHJcbiAgICBjaGVjaygnaXNBY3RpdmUnKS5cclxuICAgICAgICBub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdhY3RpdmUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLnRvQm9vbGVhbigxID8gdHJ1ZSA6IGZhbHNlKSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB3YWxsZXRWYWxpZGF0aW9uQWRtaW4gPSBbXHJcblxyXG4gICAgY2hlY2soJ3RyYW5zYWN0aW9uVHlwZScpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ1RyYW5zYWN0aW9uIFR5cGUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmlzSW4oWydkZWJpdCcsICdjcmVkaXQnXSkud2l0aE1lc3NhZ2UoJ1RoaXMgdHJhbnNhY3Rpb24gdHlwZSBpcyBub3QgdmFsaWQnKSxcclxuXHJcbiAgICBjaGVjaygnYW1vdW50JylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnQW1vdW50JyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc051bWVyaWMoeyBtaW46MH0pLndpdGhNZXNzYWdlKFwiVGhlICdBbW91bnQnIGZpZWxkIG11c3QgYmUgbnVtZXJpY1wiKSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCBkcml2ZXJSZXNldFBhc3N3b3JkVmFsaWRhdGlvbiA9IFtcclxuICAgIGNoZWNrKCdwYXNzd29yZCcpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJGaWxsIHRoZSBwYXNzd29yZFwiKSxcclxuICAgIGNoZWNrKCdjb25maXJtUGFzc3dvcmQnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiRmlsbCB0aGUgY29uZmlybSBwYXNzd29yZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHZhbHVlLCB7IHJlcSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkID0gcmVxLmJvZHkucGFzc3dvcmQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpcm1QYXNzd29yZCA9IHJlcS5ib2R5LmNvbmZpcm1QYXNzd29yZDtcclxuXHJcbiAgICAgICAgICAgIGlmKHBhc3N3b3JkICE9PSBjb25maXJtUGFzc3dvcmQpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQm90aCBwYXNzd29yZCBkb2VzIG5vdCBtYXRjaFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5dO1xyXG4iXX0=