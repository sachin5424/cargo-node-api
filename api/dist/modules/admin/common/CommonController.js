"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidator = require("express-validator");

var _CommonService = _interopRequireDefault(require("../../../services/CommonService"));

var _initdata = _interopRequireDefault(require("../../../data-base/connection/initdata"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CommonController {
  static async listStates(req, res) {
    try {
      const srvRes = await _CommonService.default.listStates(req?.query);
      return res.status(srvRes.statusCode).json({
        srvRes
      });
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async listServiceType(req, res) {
    try {
      const srvRes = await _CommonService.default.listServiceType(req?.query);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async initdb(req, res) {
    try {
      await (0, _initdata.default)();
      return res.status(200).json({
        message: 'inserted'
      });
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = CommonController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL2NvbW1vbi9Db21tb25Db250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIkNvbW1vbkNvbnRyb2xsZXIiLCJsaXN0U3RhdGVzIiwicmVxIiwicmVzIiwic3J2UmVzIiwiU2VydmljZSIsInF1ZXJ5Iiwic3RhdHVzIiwic3RhdHVzQ29kZSIsImpzb24iLCJlIiwic2VuZCIsIm1lc3NhZ2UiLCJsaXN0U2VydmljZVR5cGUiLCJpbml0ZGIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVlLE1BQU1BLGdCQUFOLENBQXVCO0FBRVgsZUFBVkMsVUFBVSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBVztBQUM5QixRQUFJO0FBQ1QsWUFBTUMsTUFBTSxHQUFHLE1BQU1DLHVCQUFRSixVQUFSLENBQW1CQyxHQUFHLEVBQUVJLEtBQXhCLENBQXJCO0FBQ1MsYUFBT0gsR0FBRyxDQUFDSSxNQUFKLENBQVdILE1BQU0sQ0FBQ0ksVUFBbEIsRUFBOEJDLElBQTlCLENBQW1DO0FBQUVMLFFBQUFBO0FBQUYsT0FBbkMsQ0FBUDtBQUNILEtBSEQsQ0FHRSxPQUFPTSxDQUFQLEVBQVU7QUFDakIsYUFBT1AsR0FBRyxDQUFDSSxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBRTJCLGVBQWZDLGVBQWUsQ0FBQ1gsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDbkMsUUFBSTtBQUNULFlBQU1DLE1BQU0sR0FBRyxNQUFNQyx1QkFBUVEsZUFBUixDQUF3QlgsR0FBRyxFQUFFSSxLQUE3QixDQUFyQjtBQUNTLGFBQU9ILEdBQUcsQ0FBQ0ksTUFBSixDQUFXSCxNQUFNLENBQUNJLFVBQWxCLEVBQThCQyxJQUE5QixtQkFBd0NMLE1BQXhDLEVBQVA7QUFDSCxLQUhELENBR0UsT0FBT00sQ0FBUCxFQUFVO0FBQ2pCLGFBQU9QLEdBQUcsQ0FBQ0ksTUFBSixDQUFXLEdBQVgsRUFBZ0JJLElBQWhCLENBQXFCO0FBQUNDLFFBQUFBLE9BQU8sRUFBRUYsQ0FBQyxDQUFDRTtBQUFaLE9BQXJCLENBQVA7QUFDQTtBQUNFOztBQUVrQixlQUFORSxNQUFNLENBQUNaLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQzFCLFFBQUk7QUFDVCxZQUFNLHdCQUFOO0FBQ1MsYUFBT0EsR0FBRyxDQUFDSSxNQUFKLENBQVcsR0FBWCxFQUFnQkUsSUFBaEIsQ0FBcUI7QUFBRUcsUUFBQUEsT0FBTyxFQUFFO0FBQVgsT0FBckIsQ0FBUDtBQUNILEtBSEQsQ0FHRSxPQUFPRixDQUFQLEVBQVU7QUFDakIsYUFBT1AsR0FBRyxDQUFDSSxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBM0JpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XHJcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL0NvbW1vblNlcnZpY2UnO1xyXG5pbXBvcnQgaW5pdGRhdGEgZnJvbSBcIi4uLy4uLy4uL2RhdGEtYmFzZS9jb25uZWN0aW9uL2luaXRkYXRhXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tb25Db250cm9sbGVyIHtcclxuICAgIFxyXG4gICAgc3RhdGljIGFzeW5jIGxpc3RTdGF0ZXMocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLmxpc3RTdGF0ZXMocmVxPy5xdWVyeSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgbGlzdFNlcnZpY2VUeXBlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5saXN0U2VydmljZVR5cGUocmVxPy5xdWVyeSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgLi4uc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgaW5pdGRiKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0YXdhaXQgaW5pdGRhdGEoKVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBtZXNzYWdlOiAnaW5zZXJ0ZWQnIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxufSJdfQ==