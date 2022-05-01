"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidator = require("express-validator");

var _Service = _interopRequireDefault(require("./_Service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TripController {
  static async list(req, res) {
    try {
      const srvRes = await _Service.default.listTrip(req?.query, req.__cuser._doc);
      return res.status(srvRes.statusCode).json({
        srvRes
      });
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const errors = (0, _expressValidator.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: errors.msg,
          errors: errors.errors
        });
      }

      const srvRes = await _Service.default.saveCustomer(req.body);
      return res.status(srvRes.statusCode).json({
        srvRes
      });
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = TripController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2N1c3RvbWVycy90cmlwL1RyaXBDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIlRyaXBDb250cm9sbGVyIiwibGlzdCIsInJlcSIsInJlcyIsInNydlJlcyIsIlNlcnZpY2UiLCJsaXN0VHJpcCIsInF1ZXJ5IiwiX19jdXNlciIsIl9kb2MiLCJzdGF0dXMiLCJzdGF0dXNDb2RlIiwianNvbiIsImUiLCJzZW5kIiwibWVzc2FnZSIsInNhdmUiLCJlcnJvcnMiLCJpc0VtcHR5IiwibXNnIiwic2F2ZUN1c3RvbWVyIiwiYm9keSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRWUsTUFBTUEsY0FBTixDQUFxQjtBQUVmLGVBQUpDLElBQUksQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDeEIsUUFBSTtBQUNULFlBQU1DLE1BQU0sR0FBRyxNQUFNQyxpQkFBUUMsUUFBUixDQUFpQkosR0FBRyxFQUFFSyxLQUF0QixFQUE2QkwsR0FBRyxDQUFDTSxPQUFKLENBQVlDLElBQXpDLENBQXJCO0FBQ1MsYUFBT04sR0FBRyxDQUFDTyxNQUFKLENBQVdOLE1BQU0sQ0FBQ08sVUFBbEIsRUFBOEJDLElBQTlCLENBQW1DO0FBQUVSLFFBQUFBO0FBQUYsT0FBbkMsQ0FBUDtBQUNILEtBSEQsQ0FHRSxPQUFPUyxDQUFQLEVBQVU7QUFDakIsYUFBT1YsR0FBRyxDQUFDTyxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBRWdCLGVBQUpDLElBQUksQ0FBQ2QsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDeEIsUUFBSTtBQUNBLFlBQU1jLE1BQU0sR0FBRyx3Q0FBaUJmLEdBQWpCLENBQWY7O0FBQ0EsVUFBSSxDQUFDZSxNQUFNLENBQUNDLE9BQVAsRUFBTCxFQUF1QjtBQUNuQixlQUFPZixHQUFHLENBQUNPLE1BQUosQ0FBVyxHQUFYLEVBQWdCRSxJQUFoQixDQUFxQjtBQUN4QkcsVUFBQUEsT0FBTyxFQUFFRSxNQUFNLENBQUNFLEdBRFE7QUFFeEJGLFVBQUFBLE1BQU0sRUFBRUEsTUFBTSxDQUFDQTtBQUZTLFNBQXJCLENBQVA7QUFJSDs7QUFFVixZQUFNYixNQUFNLEdBQUcsTUFBTUMsaUJBQVFlLFlBQVIsQ0FBcUJsQixHQUFHLENBQUNtQixJQUF6QixDQUFyQjtBQUNTLGFBQU9sQixHQUFHLENBQUNPLE1BQUosQ0FBV04sTUFBTSxDQUFDTyxVQUFsQixFQUE4QkMsSUFBOUIsQ0FBbUM7QUFBRVIsUUFBQUE7QUFBRixPQUFuQyxDQUFQO0FBQ0gsS0FYRCxDQVdFLE9BQU9TLENBQVAsRUFBVTtBQUNqQixhQUFPVixHQUFHLENBQUNPLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUExQitCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdmFsaWRhdGlvblJlc3VsdCB9IGZyb20gJ2V4cHJlc3MtdmFsaWRhdG9yJztcclxuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi9fU2VydmljZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmlwQ29udHJvbGxlciB7XHJcbiAgICBcclxuICAgIHN0YXRpYyBhc3luYyBsaXN0KHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5saXN0VHJpcChyZXE/LnF1ZXJ5LCByZXEuX19jdXNlci5fZG9jKVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IHNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIHNhdmUocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XHJcbiAgICAgICAgICAgIGlmICghZXJyb3JzLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDIyKS5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvcnMubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yczogZXJyb3JzLmVycm9yc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2Uuc2F2ZUN1c3RvbWVyKHJlcS5ib2R5KVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IHNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG59Il19