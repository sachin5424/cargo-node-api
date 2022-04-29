"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateTehsilAdmin = exports.validateSuperAdminORStateAdminORDistrict = exports.validateSuperAdminORStateAdmin = exports.validateSuperAdmin = exports.validateStateAdmin = exports.validateDistrictAdmin = exports.validateCustomAdmin = exports.validateAnyOneAdmin = exports.checkAdminPermission = void 0;

var _adminModules = _interopRequireDefault(require("../data-base/models/adminModules"));

var _modue = _interopRequireDefault(require("../data-base/models/modue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validateSuperAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 8);
};

exports.validateSuperAdmin = validateSuperAdmin;

const validateStateAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 4);
};

exports.validateStateAdmin = validateStateAdmin;

const validateDistrictAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 2);
};

exports.validateDistrictAdmin = validateDistrictAdmin;

const validateTehsilAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 1);
};

exports.validateTehsilAdmin = validateTehsilAdmin;

const validateSuperAdminORStateAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 12);
};

exports.validateSuperAdminORStateAdmin = validateSuperAdminORStateAdmin;

const validateSuperAdminORStateAdminORDistrict = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 14);
};

exports.validateSuperAdminORStateAdminORDistrict = validateSuperAdminORStateAdminORDistrict;

const validateAnyOneAdmin = async (req, res, next) => {
  validateCustomAdmin(req, res, next, 15);
};

exports.validateAnyOneAdmin = validateAnyOneAdmin;

const validateCustomAdmin = async (req, res, next, num) => {
  /* 
   * For Super Admin          add 8
   * For State Admin          add 4
   * For District Admin       add 2
   * For Taluk Admin          add 1
   */
  num = "0000" + (num >>> 0).toString(2);
  num = num.substring(num.length - 4);
  const totalPermissions = [num[0] * 1 ? 'superAdmin' : '', num[1] * 1 ? 'stateAdmin' : '', num[2] * 1 ? 'districtAdmin' : '', num[3] * 1 ? 'talukAdmin' : ''];

  try {
    const cuser = global.cuser;

    if (totalPermissions?.includes(cuser.type)) {
      next();
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized"
    });
  }
};

exports.validateCustomAdmin = validateCustomAdmin;

const checkAdminPermission = async (req, res, next, module, fillSDTValues = false, ...idKeys) => {
  const response = {
    statusCode: 401,
    message: "Unauthorized",
    status: false
  };

  if (!idKeys.length) {
    idKeys = ['state', 'district', 'taluk'];
  }

  try {
    const userType = global.cuser.type;

    if (userType === 'superAdmin') {
      response.status = true;
      response.statusCode = 200;
    } else if (userType === 'stateAdmin' || userType === 'districtAdmin' || userType === 'talukAdmin') {
      const moduleData = await _modue.default.findOne({
        key: module
      }).select('key');
      const moduleKey = moduleData.key;
      const adminModules = await _adminModules.default.findOne({
        typeKey: userType
      });

      if (adminModules && adminModules.grantedModules.includes(moduleKey)) {
        response.status = true;
        response.statusCode = 200;

        if (fillSDTValues) {
          const cuser = global.cuser;

          if (cuser.type === 'stateAdmin') {
            req.body[idKeys[0]] = cuser.state.toString();
          } else if (cuser.type === 'districtAdmin') {
            req.body[idKeys[0]] = cuser.state;
            req.body[idKeys[1]] = cuser.district;
          } else if (cuser.type === 'talukAdmin') {
            req.body[idKeys[0]] = cuser.state;
            req.body[idKeys[1]] = cuser.district;
            req.body[idKeys[2]] = cuser.taluk;
          }
        }
      }
    }
  } catch (e) {} finally {
    if (response.status) {
      next();
    } else {
      res.status(response.statusCode).send(response);
    }
  }
};

exports.checkAdminPermission = checkAdminPermission;