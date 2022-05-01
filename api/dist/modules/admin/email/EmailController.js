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

class EmailController {
  static async list(req, res) {
    try {
      const srvRes = await _EmailService.default.listSentEmails(req?.query, req.params);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const srvRes = await _EmailService.default.sendEmail(req.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  } // static async delete(req, res) {
  //     try {
  // 		const srvRes = await Service.deleteTemplatePermanent(req.params.id);
  //         return res.status(srvRes.statusCode).json({ ...srvRes });
  //     } catch (e) {
  // 		return res.status(400).send({message: e.message});
  // 	}
  // }


}

exports.default = EmailController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL2VtYWlsL0VtYWlsQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJFbWFpbENvbnRyb2xsZXIiLCJsaXN0IiwicmVxIiwicmVzIiwic3J2UmVzIiwiU2VydmljZSIsImxpc3RTZW50RW1haWxzIiwicXVlcnkiLCJwYXJhbXMiLCJzdGF0dXMiLCJzdGF0dXNDb2RlIiwianNvbiIsImUiLCJzZW5kIiwibWVzc2FnZSIsInNhdmUiLCJzZW5kRW1haWwiLCJib2R5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxlQUFOLENBQXNCO0FBRWhCLGVBQUpDLElBQUksQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDeEIsUUFBSTtBQUNULFlBQU1DLE1BQU0sR0FBRyxNQUFNQyxzQkFBUUMsY0FBUixDQUF1QkosR0FBRyxFQUFFSyxLQUE1QixFQUFtQ0wsR0FBRyxDQUFDTSxNQUF2QyxDQUFyQjtBQUNTLGFBQU9MLEdBQUcsQ0FBQ00sTUFBSixDQUFXTCxNQUFNLENBQUNNLFVBQWxCLEVBQThCQyxJQUE5QixtQkFBd0NQLE1BQXhDLEVBQVA7QUFDSCxLQUhELENBR0UsT0FBT1EsQ0FBUCxFQUFVO0FBQ2pCLGFBQU9ULEdBQUcsQ0FBQ00sTUFBSixDQUFXLEdBQVgsRUFBZ0JJLElBQWhCLENBQXFCO0FBQUNDLFFBQUFBLE9BQU8sRUFBRUYsQ0FBQyxDQUFDRTtBQUFaLE9BQXJCLENBQVA7QUFDQTtBQUNFOztBQUVnQixlQUFKQyxJQUFJLENBQUNiLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQ3hCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMsc0JBQVFXLFNBQVIsQ0FBa0JkLEdBQUcsQ0FBQ2UsSUFBdEIsQ0FBckI7QUFDUyxhQUFPZCxHQUFHLENBQUNNLE1BQUosQ0FBV0wsTUFBTSxDQUFDTSxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUCxNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9RLENBQVAsRUFBVTtBQUNqQixhQUFPVCxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRSxHQWxCZ0MsQ0FvQmpDO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNBO0FBQ0c7OztBQTNCaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9FbWFpbFNlcnZpY2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW1haWxDb250cm9sbGVyIHtcclxuICAgIFxyXG4gICAgc3RhdGljIGFzeW5jIGxpc3QocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLmxpc3RTZW50RW1haWxzKHJlcT8ucXVlcnksIHJlcS5wYXJhbXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IC4uLnNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIHNhdmUocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLnNlbmRFbWFpbChyZXEuYm9keSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBzdGF0aWMgYXN5bmMgZGVsZXRlKHJlcSwgcmVzKSB7XHJcbiAgICAvLyAgICAgdHJ5IHtcclxuXHQvLyBcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5kZWxldGVUZW1wbGF0ZVBlcm1hbmVudChyZXEucGFyYW1zLmlkKTtcclxuICAgIC8vICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAvLyAgICAgfSBjYXRjaCAoZSkge1xyXG5cdC8vIFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdC8vIFx0fVxyXG4gICAgLy8gfVxyXG5cclxufSJdfQ==