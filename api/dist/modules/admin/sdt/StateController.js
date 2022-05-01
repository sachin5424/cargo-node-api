"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SDTService = _interopRequireDefault(require("../../../services/SDTService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class StateController {
  static async list(req, res) {
    try {
      const srvRes = await _SDTService.default.listState(req?.query, req.params);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const srvRes = await _SDTService.default.saveState(req.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const srvRes = await _SDTService.default.deleteState(req.params.id);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = StateController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL3NkdC9TdGF0ZUNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiU3RhdGVDb250cm9sbGVyIiwibGlzdCIsInJlcSIsInJlcyIsInNydlJlcyIsIlNlcnZpY2UiLCJsaXN0U3RhdGUiLCJxdWVyeSIsInBhcmFtcyIsInN0YXR1cyIsInN0YXR1c0NvZGUiLCJqc29uIiwiZSIsInNlbmQiLCJtZXNzYWdlIiwic2F2ZSIsInNhdmVTdGF0ZSIsImJvZHkiLCJkZWxldGUiLCJkZWxldGVTdGF0ZSIsImlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxlQUFOLENBQXNCO0FBRWhCLGVBQUpDLElBQUksQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDeEIsUUFBSTtBQUNULFlBQU1DLE1BQU0sR0FBRyxNQUFNQyxvQkFBUUMsU0FBUixDQUFrQkosR0FBRyxFQUFFSyxLQUF2QixFQUE4QkwsR0FBRyxDQUFDTSxNQUFsQyxDQUFyQjtBQUNTLGFBQU9MLEdBQUcsQ0FBQ00sTUFBSixDQUFXTCxNQUFNLENBQUNNLFVBQWxCLEVBQThCQyxJQUE5QixtQkFBd0NQLE1BQXhDLEVBQVA7QUFDSCxLQUhELENBR0UsT0FBT1EsQ0FBUCxFQUFVO0FBQ2pCLGFBQU9ULEdBQUcsQ0FBQ00sTUFBSixDQUFXLEdBQVgsRUFBZ0JJLElBQWhCLENBQXFCO0FBQUNDLFFBQUFBLE9BQU8sRUFBRUYsQ0FBQyxDQUFDRTtBQUFaLE9BQXJCLENBQVA7QUFDQTtBQUNFOztBQUVnQixlQUFKQyxJQUFJLENBQUNiLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQ3hCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMsb0JBQVFXLFNBQVIsQ0FBa0JkLEdBQUcsQ0FBQ2UsSUFBdEIsQ0FBckI7QUFDUyxhQUFPZCxHQUFHLENBQUNNLE1BQUosQ0FBV0wsTUFBTSxDQUFDTSxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUCxNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9RLENBQVAsRUFBVTtBQUNqQixhQUFPVCxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFFa0IsZUFBTkksTUFBTSxDQUFDaEIsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDMUIsUUFBSTtBQUNULFlBQU1DLE1BQU0sR0FBRyxNQUFNQyxvQkFBUWMsV0FBUixDQUFvQmpCLEdBQUcsQ0FBQ00sTUFBSixDQUFXWSxFQUEvQixDQUFyQjtBQUNTLGFBQU9qQixHQUFHLENBQUNNLE1BQUosQ0FBV0wsTUFBTSxDQUFDTSxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUCxNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9RLENBQVAsRUFBVTtBQUNqQixhQUFPVCxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUEzQmdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvU0RUU2VydmljZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0ZUNvbnRyb2xsZXIge1xyXG4gICAgXHJcbiAgICBzdGF0aWMgYXN5bmMgbGlzdChyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2UubGlzdFN0YXRlKHJlcT8ucXVlcnksIHJlcS5wYXJhbXMpXHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgc2F2ZShyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2Uuc2F2ZVN0YXRlKHJlcS5ib2R5KVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IC4uLnNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZShyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2UuZGVsZXRlU3RhdGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbn0iXX0=