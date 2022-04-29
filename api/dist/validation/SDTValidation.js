"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.talukValidation = exports.stateValidation = exports.districtValidation = void 0;

var _import = require("../settings/import");

var _state = _interopRequireDefault(require("../data-base/models/state"));

var _district = _interopRequireDefault(require("../data-base/models/district"));

var _taluk = _interopRequireDefault(require("../data-base/models/taluk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const stateValidation = [(0, _import.check)('_id').optional().custom(async v => {
  try {
    const r = await _state.default.findById(v);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'name' field is required").isString().withMessage("The 'Name' field is not valid"), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.stateValidation = stateValidation;
const districtValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _district.default.findOne({
      _id: v
    }); //, isDeleted: false, ...getAdminFilter()});

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'Name' field is required").isString().withMessage("The 'Name' field is not valid"), (0, _import.check)('state').optional().notEmpty().withMessage("'State' field is required").custom(async value => {
  try {
    const result = await _state.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("'State' field is not valid");
  }
}), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.districtValidation = districtValidation;
const talukValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _taluk.default.findOne(_objectSpread({
      _id: v,
      isDeleted: false
    }, getAdminFilter()));

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'Name' field is required").isString().withMessage("The 'Name' field is not valid"), (0, _import.check)('state').optional().notEmpty().withMessage("'State' field is required").custom(async value => {
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
}), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.talukValidation = talukValidation;