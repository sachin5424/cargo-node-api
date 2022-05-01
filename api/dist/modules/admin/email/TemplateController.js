"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _EmailService = _interopRequireDefault(require("../../../services/EmailService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TemplateController {
  static async list(req, res) {
    try {
      const srvRes = await _EmailService.default.listTemplates(req?.query, req.params);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const srvRes = await _EmailService.default.saveTemplate(req.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const srvRes = await _EmailService.default.deleteTemplatePermanent(req.params.id);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = TemplateController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL2VtYWlsL1RlbXBsYXRlQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZUNvbnRyb2xsZXIiLCJsaXN0IiwicmVxIiwicmVzIiwic3J2UmVzIiwiU2VydmljZSIsImxpc3RUZW1wbGF0ZXMiLCJxdWVyeSIsInBhcmFtcyIsInN0YXR1cyIsInN0YXR1c0NvZGUiLCJqc29uIiwiZSIsInNlbmQiLCJtZXNzYWdlIiwic2F2ZSIsInNhdmVUZW1wbGF0ZSIsImJvZHkiLCJkZWxldGUiLCJkZWxldGVUZW1wbGF0ZVBlcm1hbmVudCIsImlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxrQkFBTixDQUF5QjtBQUVuQixlQUFKQyxJQUFJLENBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQ3hCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMsc0JBQVFDLGFBQVIsQ0FBc0JKLEdBQUcsRUFBRUssS0FBM0IsRUFBa0NMLEdBQUcsQ0FBQ00sTUFBdEMsQ0FBckI7QUFDUyxhQUFPTCxHQUFHLENBQUNNLE1BQUosQ0FBV0wsTUFBTSxDQUFDTSxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUCxNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9RLENBQVAsRUFBVTtBQUNqQixhQUFPVCxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFFZ0IsZUFBSkMsSUFBSSxDQUFDYixHQUFELEVBQU1DLEdBQU4sRUFBVztBQUN4QixRQUFJO0FBQ1QsWUFBTUMsTUFBTSxHQUFHLE1BQU1DLHNCQUFRVyxZQUFSLENBQXFCZCxHQUFHLENBQUNlLElBQXpCLENBQXJCO0FBQ1MsYUFBT2QsR0FBRyxDQUFDTSxNQUFKLENBQVdMLE1BQU0sQ0FBQ00sVUFBbEIsRUFBOEJDLElBQTlCLG1CQUF3Q1AsTUFBeEMsRUFBUDtBQUNILEtBSEQsQ0FHRSxPQUFPUSxDQUFQLEVBQVU7QUFDakIsYUFBT1QsR0FBRyxDQUFDTSxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBRWtCLGVBQU5JLE1BQU0sQ0FBQ2hCLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQzFCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMsc0JBQVFjLHVCQUFSLENBQWdDakIsR0FBRyxDQUFDTSxNQUFKLENBQVdZLEVBQTNDLENBQXJCO0FBQ1MsYUFBT2pCLEdBQUcsQ0FBQ00sTUFBSixDQUFXTCxNQUFNLENBQUNNLFVBQWxCLEVBQThCQyxJQUE5QixtQkFBd0NQLE1BQXhDLEVBQVA7QUFDSCxLQUhELENBR0UsT0FBT1EsQ0FBUCxFQUFVO0FBQ2pCLGFBQU9ULEdBQUcsQ0FBQ00sTUFBSixDQUFXLEdBQVgsRUFBZ0JJLElBQWhCLENBQXFCO0FBQUNDLFFBQUFBLE9BQU8sRUFBRUYsQ0FBQyxDQUFDRTtBQUFaLE9BQXJCLENBQVA7QUFDQTtBQUNFOztBQTNCbUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9FbWFpbFNlcnZpY2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGVDb250cm9sbGVyIHtcclxuICAgIFxyXG4gICAgc3RhdGljIGFzeW5jIGxpc3QocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLmxpc3RUZW1wbGF0ZXMocmVxPy5xdWVyeSwgcmVxLnBhcmFtcylcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5zYXZlVGVtcGxhdGUocmVxLmJvZHkpXHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgZGVsZXRlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5kZWxldGVUZW1wbGF0ZVBlcm1hbmVudChyZXEucGFyYW1zLmlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxufSJdfQ==