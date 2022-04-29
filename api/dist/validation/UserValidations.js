"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userValidation = exports.userLoginValidation = void 0;

var _import = require("../settings/import");

var _dataBase = require("../data-base");

var _state = _interopRequireDefault(require("../data-base/models/state"));

var _district = _interopRequireDefault(require("../data-base/models/district"));

var _taluk = _interopRequireDefault(require("../data-base/models/taluk"));

var _helper = require("../utls/_helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const userLoginValidation = [(0, _import.check)('email').notEmpty().withMessage("Email is required").isEmail().withMessage("Provide a valid email").custom(async v => {
  try {
    const r = await _dataBase.UserModel.findOne({
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
exports.userLoginValidation = userLoginValidation;
const userValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _dataBase.UserModel.findOne(_objectSpread({
      _id: v,
      isDeleted: false
    }, (0, _helper.getAdminFilter)()));

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
  const result = await _dataBase.UserModel.findOne({
    isDeleted: false,
    phoneNo: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A user already exist with this phone number");
      }
    } else {
      throw new Error("A user already exist with this phone number");
    }
  }
}), (0, _import.check)('email').notEmpty().withMessage("The 'Email' field is required").isEmail().withMessage("The 'Email' field is not valid").custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _dataBase.UserModel.findOne({
    isDeleted: false,
    email: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A user already exist with this email");
      }
    } else {
      throw new Error("A user already exist with this email");
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
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Photo is not an image"), (0, _import.check)('type').notEmpty().withMessage("The 'User Type' field is required").isIn(['stateAdmin', 'districtAdmin', 'talukAdmin']).withMessage("The 'User Type' field is not valid"), (0, _import.check)('address').notEmpty().withMessage("The 'Address' field is required").isString().withMessage("The 'Address' field is not valid"), (0, _import.check)('state').optional().notEmpty().withMessage("'State' field is required").custom(async value => {
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
}), (0, _import.check)('zipcode').notEmpty().withMessage("The 'Zipcode' field is required").matches(/^[1-9]{1}[0-9]{5}$/).withMessage("The 'Zipcode' field is not valid"), (0, _import.check)('adharNo').notEmpty().withMessage("The 'Adhar Number' field is required") // .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/).withMessage("The 'Adhar Number' field is not valid")
.custom(async (value, {
  req
}) => {
  const body = req.body;
  const result = await _dataBase.UserModel.findOne({
    adharNo: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A user already exist with this adhar number");
      }
    } else {
      throw new Error("A user already exist with this adhar number");
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
  const result = await _dataBase.UserModel.findOne({
    panNo: value
  });

  if (result) {
    if (body._id) {
      if (result._id != body._id) {
        throw new Error("A user already exist with this pan number");
      }
    } else {
      throw new Error("A user already exist with this pan number");
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
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Pan Card Photo is not an image"), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.userValidation = userValidation;