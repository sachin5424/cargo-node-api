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

class SDT {
  static async sdtList(req, res) {
    try {
      const srvRes = await _SDTService.default.sdtList(req?.query, req.__cuser._doc);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = SDT;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL3NkdC9TRFRDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIlNEVCIsInNkdExpc3QiLCJyZXEiLCJyZXMiLCJzcnZSZXMiLCJTZXJ2aWNlIiwicXVlcnkiLCJfX2N1c2VyIiwiX2RvYyIsInN0YXR1cyIsInN0YXR1c0NvZGUiLCJqc29uIiwiZSIsInNlbmQiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxHQUFOLENBQVU7QUFFRCxlQUFQQyxPQUFPLENBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQzNCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMsb0JBQVFKLE9BQVIsQ0FBZ0JDLEdBQUcsRUFBRUksS0FBckIsRUFBNEJKLEdBQUcsQ0FBQ0ssT0FBSixDQUFZQyxJQUF4QyxDQUFyQjtBQUNTLGFBQU9MLEdBQUcsQ0FBQ00sTUFBSixDQUFXTCxNQUFNLENBQUNNLFVBQWxCLEVBQThCQyxJQUE5QixtQkFBd0NQLE1BQXhDLEVBQVA7QUFDSCxLQUhELENBR0UsT0FBT1EsQ0FBUCxFQUFVO0FBQ2pCLGFBQU9ULEdBQUcsQ0FBQ00sTUFBSixDQUFXLEdBQVgsRUFBZ0JJLElBQWhCLENBQXFCO0FBQUNDLFFBQUFBLE9BQU8sRUFBRUYsQ0FBQyxDQUFDRTtBQUFaLE9BQXJCLENBQVA7QUFDQTtBQUNFOztBQVRvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL1NEVFNlcnZpY2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU0RUIHtcclxuICAgIFxyXG4gICAgc3RhdGljIGFzeW5jIHNkdExpc3QocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLnNkdExpc3QocmVxPy5xdWVyeSwgcmVxLl9fY3VzZXIuX2RvYylcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxufSJdfQ==