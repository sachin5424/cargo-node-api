"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwtTokenPermission = void 0;

var _customer = _interopRequireDefault(require("../../../data-base/models/customer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = require('jsonwebtoken');

var JWT_SECREATE_kEY = 'testing';

let jwtTokenPermission = async (req, res, next) => {
  try {
    var bearer = req.headers.authorization.split(" ");
    console.log(bearer); // ////console.logreq);

    var token = bearer[1];
    console.log(token);
    var decode = jwt.verify(token, "testing");
    console.log(req.headers, "?????????");

    if (decode.userId) {
      req.userId = decode.userId;
      console.log(req.userId);
      const user = await _customer.default.findOne({
        _id: req.userId
      });

      if (user) {
        ////console.loguser);
        next();
      } else {
        return res.status(401).json({
          status: 401,
          message: "Failed to authenticate token."
        });
      }
    }
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: "Failed to authenticate token."
    });
  }
};

exports.jwtTokenPermission = jwtTokenPermission;