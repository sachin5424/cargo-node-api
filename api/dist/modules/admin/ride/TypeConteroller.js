"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RideService = _interopRequireDefault(require("../../../services/RideService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TypeConteroller {
  static async list(req, res) {
    try {
      const srvRes = await _RideService.default.listRideType(req?.query, req.params);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const srvRes = await _RideService.default.saveRideType(req.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const srvRes = await _RideService.default.deleteRideType(req.params.id);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = TypeConteroller;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL3JpZGUvVHlwZUNvbnRlcm9sbGVyLmpzIl0sIm5hbWVzIjpbIlR5cGVDb250ZXJvbGxlciIsImxpc3QiLCJyZXEiLCJyZXMiLCJzcnZSZXMiLCJTZXJ2aWNlIiwibGlzdFJpZGVUeXBlIiwicXVlcnkiLCJwYXJhbXMiLCJzdGF0dXMiLCJzdGF0dXNDb2RlIiwianNvbiIsImUiLCJzZW5kIiwibWVzc2FnZSIsInNhdmUiLCJzYXZlUmlkZVR5cGUiLCJib2R5IiwiZGVsZXRlIiwiZGVsZXRlUmlkZVR5cGUiLCJpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEsZUFBTixDQUFzQjtBQUNoQixlQUFKQyxJQUFJLENBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQ3hCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMscUJBQVFDLFlBQVIsQ0FBcUJKLEdBQUcsRUFBRUssS0FBMUIsRUFBaUNMLEdBQUcsQ0FBQ00sTUFBckMsQ0FBckI7QUFDUyxhQUFPTCxHQUFHLENBQUNNLE1BQUosQ0FBV0wsTUFBTSxDQUFDTSxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUCxNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9RLENBQVAsRUFBVTtBQUNqQixhQUFPVCxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFFZ0IsZUFBSkMsSUFBSSxDQUFDYixHQUFELEVBQU1DLEdBQU4sRUFBVztBQUN4QixRQUFJO0FBQ1QsWUFBTUMsTUFBTSxHQUFHLE1BQU1DLHFCQUFRVyxZQUFSLENBQXFCZCxHQUFHLENBQUNlLElBQXpCLENBQXJCO0FBQ1MsYUFBT2QsR0FBRyxDQUFDTSxNQUFKLENBQVdMLE1BQU0sQ0FBQ00sVUFBbEIsRUFBOEJDLElBQTlCLG1CQUF3Q1AsTUFBeEMsRUFBUDtBQUNILEtBSEQsQ0FHRSxPQUFPUSxDQUFQLEVBQVU7QUFDakIsYUFBT1QsR0FBRyxDQUFDTSxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBRWtCLGVBQU5JLE1BQU0sQ0FBQ2hCLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQzFCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMscUJBQVFjLGNBQVIsQ0FBdUJqQixHQUFHLENBQUNNLE1BQUosQ0FBV1ksRUFBbEMsQ0FBckI7QUFDUyxhQUFPakIsR0FBRyxDQUFDTSxNQUFKLENBQVdMLE1BQU0sQ0FBQ00sVUFBbEIsRUFBOEJDLElBQTlCLG1CQUF3Q1AsTUFBeEMsRUFBUDtBQUNILEtBSEQsQ0FHRSxPQUFPUSxDQUFQLEVBQVU7QUFDakIsYUFBT1QsR0FBRyxDQUFDTSxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBMUJnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL1JpZGVTZXJ2aWNlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFR5cGVDb250ZXJvbGxlciB7XHJcbiAgICBzdGF0aWMgYXN5bmMgbGlzdChyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2UubGlzdFJpZGVUeXBlKHJlcT8ucXVlcnksIHJlcS5wYXJhbXMpXHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgc2F2ZShyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2Uuc2F2ZVJpZGVUeXBlKHJlcS5ib2R5KVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IC4uLnNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZShyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2UuZGVsZXRlUmlkZVR5cGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbn0iXX0=