"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jwtToken = require("../middleware/jwtToken");

var _validateAdmin = require("../middleware/validateAdmin");

var _route = _interopRequireDefault(require("./admin/vehicle/route"));

var _route2 = _interopRequireDefault(require("./admin/user/route"));

var _route3 = _interopRequireDefault(require("./admin/permission/route"));

var _route4 = _interopRequireDefault(require("./admin/trip/route"));

var _route5 = _interopRequireDefault(require("./admin/driver/route"));

var _route6 = _interopRequireDefault(require("./admin/common/route"));

var _route7 = _interopRequireDefault(require("./admin/customer/route"));

var _route8 = _interopRequireDefault(require("./admin/onlyAdmin/route"));

var _route9 = _interopRequireDefault(require("./admin/ride/route"));

var _route10 = _interopRequireDefault(require("./admin/fare/route"));

var _route11 = _interopRequireDefault(require("./admin/email/route"));

var _route12 = _interopRequireDefault(require("./admin/notification/route"));

var _route13 = _interopRequireDefault(require("./customers/user/route"));

var _route14 = _interopRequireDefault(require("./driver/user/route"));

var _route15 = _interopRequireDefault(require("./admin/sdt/route"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const api = app => {
  app.use('*', (req, res, next) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });

    if (req.method === 'OPTIONS') {
      res.status(200).json({
        status: 'Okay'
      });
    } else {
      next();
    }
  });
  app.all('/status', (req, res) => {
    res.send({
      data: {
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body
      }
    });
  });
  app.use('/admin/vehicle', _route.default);
  app.use('/admin/user', _route2.default);
  app.use('/admin/permission', _route3.default);
  app.use('/admin/trip', _route4.default);
  app.use('/admin/driver', _jwtToken.jwtTokenPermission, _route5.default);
  app.use('/admin/common', _route6.default);
  app.use('/admin/customer', _route7.default);
  app.use('/admin/sdt', _route15.default);
  app.use('/admin/adm', _jwtToken.jwtTokenPermission, _validateAdmin.validateSuperAdmin, _route8.default);
  app.use('/admin/ride', _jwtToken.jwtTokenPermission, _route9.default);
  app.use('/admin/fare-management', _jwtToken.jwtTokenPermission, _route10.default);
  app.use('/admin/email', _jwtToken.jwtTokenPermission, _route11.default);
  app.use('/admin/notification', _jwtToken.jwtTokenPermission, _route12.default);
  app.use('/customer/user', _route13.default);
  app.use('/driver/user', _route14.default);
};

var _default = api;
exports.default = _default;