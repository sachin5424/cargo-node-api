"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwtTokenPermission = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dataBase = require("../data-base");

var _Logger = _interopRequireDefault(require("../utls/Logger"));

var _config = _interopRequireDefault(require("./../utls/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jwtTokenPermission = async (req, res, next) => {
  try {
    var bearer = req.headers.authorization.split(" ");
    const token = bearer[1];

    var decode = _jsonwebtoken.default.verify(token, _config.default.jwt.secretKey);

    req.userId = decode.sub;

    try {
      const cuser = await _dataBase.UserModel.findById(decode.sub);
      req.__cuser = cuser;
      global.cuser = cuser;
      global.state = undefined;
      global.district = undefined;
      global.taluk = undefined;

      if (cuser.type === 'stateAdmin') {
        global.state = cuser.state;
      } else if (cuser.type === 'districtAdmin') {
        global.state = cuser.state;
        global.district = cuser.district;
      } else if (cuser.type === 'talukAdmin') {
        global.state = cuser.state;
        global.district = cuser.district;
        global.taluk = cuser.taluk;
      }
    } catch (e) {
      throw new Error('User does not exist');
    }

    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: "Failed to authenticate. Try login again!"
    });
  }
};

exports.jwtTokenPermission = jwtTokenPermission;