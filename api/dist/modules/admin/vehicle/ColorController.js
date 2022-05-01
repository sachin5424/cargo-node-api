"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _VehicleService = _interopRequireDefault(require("../../../services/VehicleService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ColorController {
  static async list(req, res) {
    try {
      const srvRes = await _VehicleService.default.listColor(req?.query, req.params);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const srvRes = await _VehicleService.default.saveColor(req.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const srvRes = await _VehicleService.default.deleteColor(req.params.id);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = ColorController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL3ZlaGljbGUvQ29sb3JDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkNvbG9yQ29udHJvbGxlciIsImxpc3QiLCJyZXEiLCJyZXMiLCJzcnZSZXMiLCJTZXJ2aWNlIiwibGlzdENvbG9yIiwicXVlcnkiLCJwYXJhbXMiLCJzdGF0dXMiLCJzdGF0dXNDb2RlIiwianNvbiIsImUiLCJzZW5kIiwibWVzc2FnZSIsInNhdmUiLCJzYXZlQ29sb3IiLCJib2R5IiwiZGVsZXRlIiwiZGVsZXRlQ29sb3IiLCJpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEsZUFBTixDQUFzQjtBQUVoQixlQUFKQyxJQUFJLENBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQ3hCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMsd0JBQVFDLFNBQVIsQ0FBa0JKLEdBQUcsRUFBRUssS0FBdkIsRUFBOEJMLEdBQUcsQ0FBQ00sTUFBbEMsQ0FBckI7QUFDUyxhQUFPTCxHQUFHLENBQUNNLE1BQUosQ0FBV0wsTUFBTSxDQUFDTSxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUCxNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9RLENBQVAsRUFBVTtBQUNqQixhQUFPVCxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFFZ0IsZUFBSkMsSUFBSSxDQUFDYixHQUFELEVBQU1DLEdBQU4sRUFBVztBQUN4QixRQUFJO0FBQ1QsWUFBTUMsTUFBTSxHQUFHLE1BQU1DLHdCQUFRVyxTQUFSLENBQWtCZCxHQUFHLENBQUNlLElBQXRCLENBQXJCO0FBQ1MsYUFBT2QsR0FBRyxDQUFDTSxNQUFKLENBQVdMLE1BQU0sQ0FBQ00sVUFBbEIsRUFBOEJDLElBQTlCLG1CQUF3Q1AsTUFBeEMsRUFBUDtBQUNILEtBSEQsQ0FHRSxPQUFPUSxDQUFQLEVBQVU7QUFDakIsYUFBT1QsR0FBRyxDQUFDTSxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBRWtCLGVBQU5JLE1BQU0sQ0FBQ2hCLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQzFCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMsd0JBQVFjLFdBQVIsQ0FBb0JqQixHQUFHLENBQUNNLE1BQUosQ0FBV1ksRUFBL0IsQ0FBckI7QUFDUyxhQUFPakIsR0FBRyxDQUFDTSxNQUFKLENBQVdMLE1BQU0sQ0FBQ00sVUFBbEIsRUFBOEJDLElBQTlCLG1CQUF3Q1AsTUFBeEMsRUFBUDtBQUNILEtBSEQsQ0FHRSxPQUFPUSxDQUFQLEVBQVU7QUFDakIsYUFBT1QsR0FBRyxDQUFDTSxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBM0JnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL1ZlaGljbGVTZXJ2aWNlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbG9yQ29udHJvbGxlciB7XHJcbiAgICBcclxuICAgIHN0YXRpYyBhc3luYyBsaXN0KHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5saXN0Q29sb3IocmVxPy5xdWVyeSwgcmVxLnBhcmFtcylcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5zYXZlQ29sb3IocmVxLmJvZHkpXHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgZGVsZXRlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5kZWxldGVDb2xvcihyZXEucGFyYW1zLmlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxufSJdfQ==