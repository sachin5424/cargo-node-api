"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidator = require("express-validator");

var _VehicleService = _interopRequireDefault(require("../../../services/VehicleService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class VehicleController {
  static async list(req, res) {
    try {
      const srvRes = await _VehicleService.default.listVehicle(req?.query, req.params);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const srvRes = await _VehicleService.default.saveVehicle(req.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const srvRes = await _VehicleService.default.deleteVehicle(req.params.id);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = VehicleController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL3ZlaGljbGUvVmVoaWNsZUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiVmVoaWNsZUNvbnRyb2xsZXIiLCJsaXN0IiwicmVxIiwicmVzIiwic3J2UmVzIiwiU2VydmljZSIsImxpc3RWZWhpY2xlIiwicXVlcnkiLCJwYXJhbXMiLCJzdGF0dXMiLCJzdGF0dXNDb2RlIiwianNvbiIsImUiLCJzZW5kIiwibWVzc2FnZSIsInNhdmUiLCJzYXZlVmVoaWNsZSIsImJvZHkiLCJkZWxldGUiLCJkZWxldGVWZWhpY2xlIiwiaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7OztBQUVlLE1BQU1BLGlCQUFOLENBQXdCO0FBRWxCLGVBQUpDLElBQUksQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDeEIsUUFBSTtBQUNULFlBQU1DLE1BQU0sR0FBRyxNQUFNQyx3QkFBUUMsV0FBUixDQUFvQkosR0FBRyxFQUFFSyxLQUF6QixFQUFnQ0wsR0FBRyxDQUFDTSxNQUFwQyxDQUFyQjtBQUNTLGFBQU9MLEdBQUcsQ0FBQ00sTUFBSixDQUFXTCxNQUFNLENBQUNNLFVBQWxCLEVBQThCQyxJQUE5QixtQkFBd0NQLE1BQXhDLEVBQVA7QUFDSCxLQUhELENBR0UsT0FBT1EsQ0FBUCxFQUFVO0FBQ2pCLGFBQU9ULEdBQUcsQ0FBQ00sTUFBSixDQUFXLEdBQVgsRUFBZ0JJLElBQWhCLENBQXFCO0FBQUNDLFFBQUFBLE9BQU8sRUFBRUYsQ0FBQyxDQUFDRTtBQUFaLE9BQXJCLENBQVA7QUFDQTtBQUNFOztBQUVnQixlQUFKQyxJQUFJLENBQUNiLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQ3hCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMsd0JBQVFXLFdBQVIsQ0FBb0JkLEdBQUcsQ0FBQ2UsSUFBeEIsQ0FBckI7QUFDUyxhQUFPZCxHQUFHLENBQUNNLE1BQUosQ0FBV0wsTUFBTSxDQUFDTSxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUCxNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9RLENBQVAsRUFBVTtBQUNqQixhQUFPVCxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFFa0IsZUFBTkksTUFBTSxDQUFDaEIsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDMUIsUUFBSTtBQUNULFlBQU1DLE1BQU0sR0FBRyxNQUFNQyx3QkFBUWMsYUFBUixDQUFzQmpCLEdBQUcsQ0FBQ00sTUFBSixDQUFXWSxFQUFqQyxDQUFyQjtBQUNTLGFBQU9qQixHQUFHLENBQUNNLE1BQUosQ0FBV0wsTUFBTSxDQUFDTSxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUCxNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9RLENBQVAsRUFBVTtBQUNqQixhQUFPVCxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUEzQmtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcclxuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvVmVoaWNsZVNlcnZpY2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVoaWNsZUNvbnRyb2xsZXIge1xyXG4gICAgXHJcbiAgICBzdGF0aWMgYXN5bmMgbGlzdChyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2UubGlzdFZlaGljbGUocmVxPy5xdWVyeSwgcmVxLnBhcmFtcylcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5zYXZlVmVoaWNsZShyZXEuYm9keSlcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBkZWxldGUocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLmRlbGV0ZVZlaGljbGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbn0iXX0=