"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidator = require("express-validator");

var _OnlyAdminService = _interopRequireDefault(require("../../../services/OnlyAdminService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CustomerController {
  static async listModules(req, res) {
    try {
      const srvRes = await _OnlyAdminService.default.listModules(req?.query, req.params);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async saveModule(req, res) {
    try {
      const srvRes = await _OnlyAdminService.default.saveModule(req?.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async deleteModule(req, res) {
    try {
      const srvRes = await _OnlyAdminService.default.deleteModule(req.params._id);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async adminModules(req, res) {
    try {
      const srvRes = await _OnlyAdminService.default.adminModules(req?.query, req.params);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async saveAdminModules(req, res) {
    try {
      const errors = (0, _expressValidator.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }

      const srvRes = await _OnlyAdminService.default.saveAdminModules(req.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = CustomerController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL29ubHlBZG1pbi9Db250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkN1c3RvbWVyQ29udHJvbGxlciIsImxpc3RNb2R1bGVzIiwicmVxIiwicmVzIiwic3J2UmVzIiwiU2VydmljZSIsInF1ZXJ5IiwicGFyYW1zIiwic3RhdHVzIiwic3RhdHVzQ29kZSIsImpzb24iLCJlIiwic2VuZCIsIm1lc3NhZ2UiLCJzYXZlTW9kdWxlIiwiYm9keSIsImRlbGV0ZU1vZHVsZSIsIl9pZCIsImFkbWluTW9kdWxlcyIsInNhdmVBZG1pbk1vZHVsZXMiLCJlcnJvcnMiLCJpc0VtcHR5IiwibXNnIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxrQkFBTixDQUF5QjtBQUVaLGVBQVhDLFdBQVcsQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDL0IsUUFBSTtBQUNULFlBQU1DLE1BQU0sR0FBRyxNQUFNQywwQkFBUUosV0FBUixDQUFvQkMsR0FBRyxFQUFFSSxLQUF6QixFQUFnQ0osR0FBRyxDQUFDSyxNQUFwQyxDQUFyQjtBQUNTLGFBQU9KLEdBQUcsQ0FBQ0ssTUFBSixDQUFXSixNQUFNLENBQUNLLFVBQWxCLEVBQThCQyxJQUE5QixtQkFBd0NOLE1BQXhDLEVBQVA7QUFDSCxLQUhELENBR0UsT0FBT08sQ0FBUCxFQUFVO0FBQ2pCLGFBQU9SLEdBQUcsQ0FBQ0ssTUFBSixDQUFXLEdBQVgsRUFBZ0JJLElBQWhCLENBQXFCO0FBQUNDLFFBQUFBLE9BQU8sRUFBRUYsQ0FBQyxDQUFDRTtBQUFaLE9BQXJCLENBQVA7QUFDQTtBQUNFOztBQUVzQixlQUFWQyxVQUFVLENBQUNaLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQzlCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMsMEJBQVFTLFVBQVIsQ0FBbUJaLEdBQUcsRUFBRWEsSUFBeEIsQ0FBckI7QUFDUyxhQUFPWixHQUFHLENBQUNLLE1BQUosQ0FBV0osTUFBTSxDQUFDSyxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDTixNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9PLENBQVAsRUFBVTtBQUNqQixhQUFPUixHQUFHLENBQUNLLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFFd0IsZUFBWkcsWUFBWSxDQUFDZCxHQUFELEVBQU1DLEdBQU4sRUFBVztBQUNoQyxRQUFJO0FBQ1QsWUFBTUMsTUFBTSxHQUFHLE1BQU1DLDBCQUFRVyxZQUFSLENBQXFCZCxHQUFHLENBQUNLLE1BQUosQ0FBV1UsR0FBaEMsQ0FBckI7QUFDUyxhQUFPZCxHQUFHLENBQUNLLE1BQUosQ0FBV0osTUFBTSxDQUFDSyxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDTixNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9PLENBQVAsRUFBVTtBQUNqQixhQUFPUixHQUFHLENBQUNLLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFFd0IsZUFBWkssWUFBWSxDQUFDaEIsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDaEMsUUFBSTtBQUNULFlBQU1DLE1BQU0sR0FBRyxNQUFNQywwQkFBUWEsWUFBUixDQUFxQmhCLEdBQUcsRUFBRUksS0FBMUIsRUFBaUNKLEdBQUcsQ0FBQ0ssTUFBckMsQ0FBckI7QUFDUyxhQUFPSixHQUFHLENBQUNLLE1BQUosQ0FBV0osTUFBTSxDQUFDSyxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDTixNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9PLENBQVAsRUFBVTtBQUNqQixhQUFPUixHQUFHLENBQUNLLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFFNEIsZUFBaEJNLGdCQUFnQixDQUFDakIsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDcEMsUUFBSTtBQUNBLFlBQU1pQixNQUFNLEdBQUcsd0NBQWlCbEIsR0FBakIsQ0FBZjs7QUFDQSxVQUFJLENBQUNrQixNQUFNLENBQUNDLE9BQVAsRUFBTCxFQUF1QjtBQUNuQixlQUFPbEIsR0FBRyxDQUFDSyxNQUFKLENBQVcsR0FBWCxFQUFnQkUsSUFBaEIsQ0FBcUI7QUFDeEJHLFVBQUFBLE9BQU8sRUFBRU8sTUFBTSxDQUFDRSxHQURRO0FBRXhCRixVQUFBQSxNQUFNLEVBQUVBLE1BQU0sQ0FBQ0E7QUFGUyxTQUFyQixDQUFQO0FBSUg7O0FBRVYsWUFBTWhCLE1BQU0sR0FBRyxNQUFNQywwQkFBUWMsZ0JBQVIsQ0FBeUJqQixHQUFHLENBQUNhLElBQTdCLENBQXJCO0FBQ1MsYUFBT1osR0FBRyxDQUFDSyxNQUFKLENBQVdKLE1BQU0sQ0FBQ0ssVUFBbEIsRUFBOEJDLElBQTlCLG1CQUF3Q04sTUFBeEMsRUFBUDtBQUNILEtBWEQsQ0FXRSxPQUFPTyxDQUFQLEVBQVU7QUFDakIsYUFBT1IsR0FBRyxDQUFDSyxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBckRtQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XHJcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL09ubHlBZG1pblNlcnZpY2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VzdG9tZXJDb250cm9sbGVyIHtcclxuICAgIFxyXG4gICAgc3RhdGljIGFzeW5jIGxpc3RNb2R1bGVzKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5saXN0TW9kdWxlcyhyZXE/LnF1ZXJ5LCByZXEucGFyYW1zKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlTW9kdWxlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5zYXZlTW9kdWxlKHJlcT8uYm9keSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgZGVsZXRlTW9kdWxlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5kZWxldGVNb2R1bGUocmVxLnBhcmFtcy5faWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IC4uLnNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBhc3luYyBhZG1pbk1vZHVsZXMocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLmFkbWluTW9kdWxlcyhyZXE/LnF1ZXJ5LCByZXEucGFyYW1zKVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IC4uLnNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIHNhdmVBZG1pbk1vZHVsZXMocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XHJcbiAgICAgICAgICAgIGlmICghZXJyb3JzLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDIyKS5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvcnMubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yczogZXJyb3JzLmVycm9yc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2Uuc2F2ZUFkbWluTW9kdWxlcyhyZXEuYm9keSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxufSJdfQ==