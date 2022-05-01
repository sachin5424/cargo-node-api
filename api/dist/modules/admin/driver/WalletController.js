"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _DriverService = _interopRequireDefault(require("../../../services/DriverService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class WalletController {
  static async list(req, res) {
    try {
      const srvRes = await _DriverService.default.listWalletHistory(req?.query, req.__cuser._doc);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const data = await _DriverService.default.walletDataLogicAdmin(req.body);
      const srvRes = await _DriverService.default.saveWalletHistory(data);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = WalletController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL2RyaXZlci9XYWxsZXRDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbIldhbGxldENvbnRyb2xsZXIiLCJsaXN0IiwicmVxIiwicmVzIiwic3J2UmVzIiwiU2VydmljZSIsImxpc3RXYWxsZXRIaXN0b3J5IiwicXVlcnkiLCJfX2N1c2VyIiwiX2RvYyIsInN0YXR1cyIsInN0YXR1c0NvZGUiLCJqc29uIiwiZSIsInNlbmQiLCJtZXNzYWdlIiwic2F2ZSIsImRhdGEiLCJ3YWxsZXREYXRhTG9naWNBZG1pbiIsImJvZHkiLCJzYXZlV2FsbGV0SGlzdG9yeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEsZ0JBQU4sQ0FBdUI7QUFFakIsZUFBSkMsSUFBSSxDQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBVztBQUN4QixRQUFJO0FBQ1QsWUFBTUMsTUFBTSxHQUFHLE1BQU1DLHVCQUFRQyxpQkFBUixDQUEwQkosR0FBRyxFQUFFSyxLQUEvQixFQUFzQ0wsR0FBRyxDQUFDTSxPQUFKLENBQVlDLElBQWxELENBQXJCO0FBQ1MsYUFBT04sR0FBRyxDQUFDTyxNQUFKLENBQVdOLE1BQU0sQ0FBQ08sVUFBbEIsRUFBOEJDLElBQTlCLG1CQUF3Q1IsTUFBeEMsRUFBUDtBQUNILEtBSEQsQ0FHRSxPQUFPUyxDQUFQLEVBQVU7QUFDakIsYUFBT1YsR0FBRyxDQUFDTyxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBRWdCLGVBQUpDLElBQUksQ0FBQ2QsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDeEIsUUFBSTtBQUNBLFlBQU1jLElBQUksR0FBRyxNQUFNWix1QkFBUWEsb0JBQVIsQ0FBNkJoQixHQUFHLENBQUNpQixJQUFqQyxDQUFuQjtBQUNULFlBQU1mLE1BQU0sR0FBRyxNQUFNQyx1QkFBUWUsaUJBQVIsQ0FBMEJILElBQTFCLENBQXJCO0FBQ1MsYUFBT2QsR0FBRyxDQUFDTyxNQUFKLENBQVdOLE1BQU0sQ0FBQ08sVUFBbEIsRUFBOEJDLElBQTlCLG1CQUF3Q1IsTUFBeEMsRUFBUDtBQUNILEtBSkQsQ0FJRSxPQUFPUyxDQUFQLEVBQVU7QUFDakIsYUFBT1YsR0FBRyxDQUFDTyxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBbkJpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL0RyaXZlclNlcnZpY2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbGV0Q29udHJvbGxlciB7XHJcbiAgICBcclxuICAgIHN0YXRpYyBhc3luYyBsaXN0KHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5saXN0V2FsbGV0SGlzdG9yeShyZXE/LnF1ZXJ5LCByZXEuX19jdXNlci5fZG9jKVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IC4uLnNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIHNhdmUocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgU2VydmljZS53YWxsZXREYXRhTG9naWNBZG1pbihyZXEuYm9keSk7XHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2Uuc2F2ZVdhbGxldEhpc3RvcnkoZGF0YSlcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxufSJdfQ==