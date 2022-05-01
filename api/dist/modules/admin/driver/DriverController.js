"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidator = require("express-validator");

var _DriverService = _interopRequireDefault(require("../../../services/DriverService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DriverController {
  static async list(req, res) {
    try {
      const srvRes = await _DriverService.default.listDriver(req?.query, req.__cuser._doc);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const srvRes = await _DriverService.default.saveDriver(req.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const srvRes = await _DriverService.default.deleteDriver(req.params.id);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = DriverController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL2RyaXZlci9Ecml2ZXJDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkRyaXZlckNvbnRyb2xsZXIiLCJsaXN0IiwicmVxIiwicmVzIiwic3J2UmVzIiwiU2VydmljZSIsImxpc3REcml2ZXIiLCJxdWVyeSIsIl9fY3VzZXIiLCJfZG9jIiwic3RhdHVzIiwic3RhdHVzQ29kZSIsImpzb24iLCJlIiwic2VuZCIsIm1lc3NhZ2UiLCJzYXZlIiwic2F2ZURyaXZlciIsImJvZHkiLCJkZWxldGUiLCJkZWxldGVEcml2ZXIiLCJwYXJhbXMiLCJpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEsZ0JBQU4sQ0FBdUI7QUFFakIsZUFBSkMsSUFBSSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBVztBQUN4QixRQUFJO0FBQ1QsWUFBTUMsTUFBTSxHQUFHLE1BQU1DLHVCQUFRQyxVQUFSLENBQW1CSixHQUFHLEVBQUVLLEtBQXhCLEVBQStCTCxHQUFHLENBQUNNLE9BQUosQ0FBWUMsSUFBM0MsQ0FBckI7QUFDUyxhQUFPTixHQUFHLENBQUNPLE1BQUosQ0FBV04sTUFBTSxDQUFDTyxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUixNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9TLENBQVAsRUFBVTtBQUNqQixhQUFPVixHQUFHLENBQUNPLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFFZ0IsZUFBSkMsSUFBSSxDQUFDZCxHQUFELEVBQU1DLEdBQU4sRUFBVztBQUN4QixRQUFJO0FBQ1QsWUFBTUMsTUFBTSxHQUFHLE1BQU1DLHVCQUFRWSxVQUFSLENBQW1CZixHQUFHLENBQUNnQixJQUF2QixDQUFyQjtBQUNTLGFBQU9mLEdBQUcsQ0FBQ08sTUFBSixDQUFXTixNQUFNLENBQUNPLFVBQWxCLEVBQThCQyxJQUE5QixtQkFBd0NSLE1BQXhDLEVBQVA7QUFDSCxLQUhELENBR0UsT0FBT1MsQ0FBUCxFQUFVO0FBQ2pCLGFBQU9WLEdBQUcsQ0FBQ08sTUFBSixDQUFXLEdBQVgsRUFBZ0JJLElBQWhCLENBQXFCO0FBQUNDLFFBQUFBLE9BQU8sRUFBRUYsQ0FBQyxDQUFDRTtBQUFaLE9BQXJCLENBQVA7QUFDQTtBQUNFOztBQUVrQixlQUFOSSxNQUFNLENBQUNqQixHQUFELEVBQU1DLEdBQU4sRUFBVztBQUMxQixRQUFJO0FBQ1QsWUFBTUMsTUFBTSxHQUFHLE1BQU1DLHVCQUFRZSxZQUFSLENBQXFCbEIsR0FBRyxDQUFDbUIsTUFBSixDQUFXQyxFQUFoQyxDQUFyQjtBQUNTLGFBQU9uQixHQUFHLENBQUNPLE1BQUosQ0FBV04sTUFBTSxDQUFDTyxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUixNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9TLENBQVAsRUFBVTtBQUNqQixhQUFPVixHQUFHLENBQUNPLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUEzQmlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcclxuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvRHJpdmVyU2VydmljZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcml2ZXJDb250cm9sbGVyIHtcclxuICAgIFxyXG4gICAgc3RhdGljIGFzeW5jIGxpc3QocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLmxpc3REcml2ZXIocmVxPy5xdWVyeSwgcmVxLl9fY3VzZXIuX2RvYylcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5zYXZlRHJpdmVyKHJlcS5ib2R5KVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IC4uLnNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZShyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2UuZGVsZXRlRHJpdmVyKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IC4uLnNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG59Il19