"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locationValidation = exports.locationSearch = exports.customerValidation = exports.customerResetPasswordValidation = exports.customerLoginValidation = void 0;

var _import = require("../settings/import");

var _customer = _interopRequireDefault(require("../data-base/models/customer"));

var _customerLocation = _interopRequireDefault(require("../data-base/models/customerLocation"));

var _state = _interopRequireDefault(require("../data-base/models/state"));

var _district = _interopRequireDefault(require("../data-base/models/district"));

var _taluk = _interopRequireDefault(require("../data-base/models/taluk"));

var _helper = require("../utls/_helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const customerLoginValidation = [(0, _import.check)('email').notEmpty().withMessage("Email is required").isEmail().withMessage("Provide a valid email").custom(async v => {
  try {
    const r = await _customer.default.findOne({
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
exports.customerLoginValidation = customerLoginValidation;
const customerValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async (v, {
  req
}) => {
  try {
    const search = {
      _id: v,
      isDeleted: false,
      state: global.state,
      district: global.district,
      taluk: global.taluk
    };
    (0, _helper.clearSearch)(search);
    const r = await _customer.default.findOne(search);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('firstName').notEmpty().withMessage("The 'First Name' field is required").isString().withMessage("The 'First Name' field is not valid"), (0, _import.check)('lastName').notEmpty().withMessage("The 'Last Name' field is required").isString().withMessage("The 'Last Name' field is not valid"), (0, _import.check)('phoneNo').notEmpty().withMessage("The 'Phone Number' field is required").matches(/^[3-9]{1}[0-9]{9}$/).withMessage("The 'Phone Number' field is not valid").custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _customer.default.findOne({
    isDeleted: false,
    phoneNo: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A customer already exist with this phone number");
      }
    } else {
      throw new Error("A customer already exist with this phone number");
    }
  }
}), (0, _import.check)('email').notEmpty().withMessage("The 'Email' field is required").isEmail().withMessage("The 'Email' field is not valid").custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _customer.default.findOne({
    isDeleted: false,
    email: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A customer already exist with this email");
      }
    } else {
      throw new Error("A customer already exist with this email");
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
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Photo is not an image"), (0, _import.check)('address').notEmpty().withMessage("The 'Address' field is required").isString().withMessage("The 'Address' field is not valid"), (0, _import.check)('state').notEmpty().withMessage("The 'State' field is required") // .isString().withMessage("The 'State' field is not valid")
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
}), (0, _import.check)('zipcode').notEmpty().withMessage("The 'Zipcode' field is required").matches(/^[1-9]{1}[0-9]{5}$/).withMessage("The 'Zipcode' field is not valid"), (0, _import.check)('isActive').optional().notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.customerValidation = customerValidation;
const locationSearch = [(0, _import.check)('customer').notEmpty().withMessage("A customer is required").custom(async v => {
  try {
    const r = await _customer.default.findById(v);

    if (!r) {
      throw new Error("Customer is not valid");
    }
  } catch (e) {
    throw new Error("Customer is not valid");
  }
})];
exports.locationSearch = locationSearch;
const locationValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _customerLocation.default.findById(v);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('customer').notEmpty().withMessage("Select a customer").custom(async v => {
  try {
    const r = await _customer.default.findById(v);

    if (!r) {
      throw new Error("Customer not found");
    }
  } catch (e) {
    throw new Error("Customer does not exit. Please check or refresh");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'Name' field is required").isString().withMessage("The 'Name' field is not valid"), (0, _import.check)('latlong').notEmpty().withMessage("The 'Latitude & Longitude' field is required").isLatLong().withMessage("The 'Latitude & Longitude' field is not valid")];
exports.locationValidation = locationValidation;
const customerResetPasswordValidation = [(0, _import.check)('password').notEmpty().withMessage("Fill the password"), (0, _import.check)('confirmPassword').notEmpty().withMessage("Fill the confirm password").custom(async (value, {
  req
}) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword) {
    throw new Error("Both password does not match");
  }
})];
exports.customerResetPasswordValidation = customerResetPasswordValidation;