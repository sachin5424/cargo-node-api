"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expressValidator = require("express-validator");

var _CustomerService = _interopRequireDefault(require("../../../services/CustomerService"));

var _sendEmail = require("../../../thrirdParty/emailServices/customer/sendEmail");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CustomerController {
  static async list(req, res) {
    try {
      const srvRes = await _CustomerService.default.listCustomer(req?.query, req.params);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
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

      const srvRes = await _CustomerService.default.saveCustomer(req.body);

      if (!req.body._id) {
        try {
          await (0, _sendEmail.sendSignupMail)(req.body);
          srvRes.message = "A confirmation email is sent to the email. Please verify!";
        } catch (e) {
          _CustomerService.default.deleteCustomerPermanent({
            email: req.body.email
          });

          throw new Error("Error while sending confirmation email. Please try again!");
        }
      }

      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const srvRes = await _CustomerService.default.deleteCustomer(req.params.id, {
        state: global.state,
        district: global.district,
        taluk: global.taluk
      });
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

exports.default = CustomerController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL2N1c3RvbWVyL0N1c3RvbWVyQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJDdXN0b21lckNvbnRyb2xsZXIiLCJsaXN0IiwicmVxIiwicmVzIiwic3J2UmVzIiwiU2VydmljZSIsImxpc3RDdXN0b21lciIsInF1ZXJ5IiwicGFyYW1zIiwic3RhdHVzIiwic3RhdHVzQ29kZSIsImpzb24iLCJlIiwic2VuZCIsIm1lc3NhZ2UiLCJzYXZlIiwiZXJyb3JzIiwiaXNFbXB0eSIsIm1zZyIsInNhdmVDdXN0b21lciIsImJvZHkiLCJfaWQiLCJkZWxldGVDdXN0b21lclBlcm1hbmVudCIsImVtYWlsIiwiRXJyb3IiLCJkZWxldGUiLCJkZWxldGVDdXN0b21lciIsImlkIiwic3RhdGUiLCJnbG9iYWwiLCJkaXN0cmljdCIsInRhbHVrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxrQkFBTixDQUF5QjtBQUVuQixlQUFKQyxJQUFJLENBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQ3hCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMseUJBQVFDLFlBQVIsQ0FBcUJKLEdBQUcsRUFBRUssS0FBMUIsRUFBaUNMLEdBQUcsQ0FBQ00sTUFBckMsQ0FBckI7QUFDUyxhQUFPTCxHQUFHLENBQUNNLE1BQUosQ0FBV0wsTUFBTSxDQUFDTSxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUCxNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9RLENBQVAsRUFBVTtBQUNqQixhQUFPVCxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFFZ0IsZUFBSkMsSUFBSSxDQUFDYixHQUFELEVBQU1DLEdBQU4sRUFBVztBQUN4QixRQUFJO0FBQ0EsWUFBTWEsTUFBTSxHQUFHLHdDQUFpQmQsR0FBakIsQ0FBZjs7QUFDQSxVQUFJLENBQUNjLE1BQU0sQ0FBQ0MsT0FBUCxFQUFMLEVBQXVCO0FBQ25CLGVBQU9kLEdBQUcsQ0FBQ00sTUFBSixDQUFXLEdBQVgsRUFBZ0JFLElBQWhCLENBQXFCO0FBQ3hCRyxVQUFBQSxPQUFPLEVBQUVFLE1BQU0sQ0FBQ0UsR0FEUTtBQUV4QkYsVUFBQUEsTUFBTSxFQUFFQSxNQUFNLENBQUNBO0FBRlMsU0FBckIsQ0FBUDtBQUlIOztBQUVWLFlBQU1aLE1BQU0sR0FBRyxNQUFNQyx5QkFBUWMsWUFBUixDQUFxQmpCLEdBQUcsQ0FBQ2tCLElBQXpCLENBQXJCOztBQUVTLFVBQUcsQ0FBQ2xCLEdBQUcsQ0FBQ2tCLElBQUosQ0FBU0MsR0FBYixFQUFpQjtBQUNiLFlBQUc7QUFDQyxnQkFBTSwrQkFBZW5CLEdBQUcsQ0FBQ2tCLElBQW5CLENBQU47QUFDQWhCLFVBQUFBLE1BQU0sQ0FBQ1UsT0FBUCxHQUFpQiwyREFBakI7QUFDSCxTQUhELENBR0UsT0FBTUYsQ0FBTixFQUFRO0FBQ05QLG1DQUFRaUIsdUJBQVIsQ0FBZ0M7QUFBQ0MsWUFBQUEsS0FBSyxFQUFFckIsR0FBRyxDQUFDa0IsSUFBSixDQUFTRztBQUFqQixXQUFoQzs7QUFDQSxnQkFBTSxJQUFJQyxLQUFKLENBQVUsMkRBQVYsQ0FBTjtBQUNIO0FBQ0o7O0FBQ0QsYUFBT3JCLEdBQUcsQ0FBQ00sTUFBSixDQUFXTCxNQUFNLENBQUNNLFVBQWxCLEVBQThCQyxJQUE5QixtQkFBd0NQLE1BQXhDLEVBQVA7QUFDSCxLQXJCRCxDQXFCRSxPQUFPUSxDQUFQLEVBQVU7QUFDakIsYUFBT1QsR0FBRyxDQUFDTSxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBRWtCLGVBQU5XLE1BQU0sQ0FBQ3ZCLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQzFCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMseUJBQVFxQixjQUFSLENBQXVCeEIsR0FBRyxDQUFDTSxNQUFKLENBQVdtQixFQUFsQyxFQUFzQztBQUFDQyxRQUFBQSxLQUFLLEVBQUVDLE1BQU0sQ0FBQ0QsS0FBZjtBQUFzQkUsUUFBQUEsUUFBUSxFQUFFRCxNQUFNLENBQUNDLFFBQXZDO0FBQWlEQyxRQUFBQSxLQUFLLEVBQUVGLE1BQU0sQ0FBQ0U7QUFBL0QsT0FBdEMsQ0FBckI7QUFDUyxhQUFPNUIsR0FBRyxDQUFDTSxNQUFKLENBQVdMLE1BQU0sQ0FBQ00sVUFBbEIsRUFBOEJDLElBQTlCLENBQW1DO0FBQUVQLFFBQUFBO0FBQUYsT0FBbkMsQ0FBUDtBQUNILEtBSEQsQ0FHRSxPQUFPUSxDQUFQLEVBQVU7QUFDakIsYUFBT1QsR0FBRyxDQUFDTSxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBN0NtQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICdleHByZXNzLXZhbGlkYXRvcic7XHJcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL0N1c3RvbWVyU2VydmljZSc7XHJcbmltcG9ydCB7IHNlbmRTaWdudXBNYWlsIH0gZnJvbSAnLi4vLi4vLi4vdGhyaXJkUGFydHkvZW1haWxTZXJ2aWNlcy9jdXN0b21lci9zZW5kRW1haWwnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3VzdG9tZXJDb250cm9sbGVyIHtcclxuICAgIFxyXG4gICAgc3RhdGljIGFzeW5jIGxpc3QocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLmxpc3RDdXN0b21lcihyZXE/LnF1ZXJ5LCByZXEucGFyYW1zKVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IC4uLnNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIHNhdmUocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvcnMgPSB2YWxpZGF0aW9uUmVzdWx0KHJlcSk7XHJcbiAgICAgICAgICAgIGlmICghZXJyb3JzLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDIyKS5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvcnMubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yczogZXJyb3JzLmVycm9yc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2Uuc2F2ZUN1c3RvbWVyKHJlcS5ib2R5KVxyXG5cclxuICAgICAgICAgICAgaWYoIXJlcS5ib2R5Ll9pZCl7XHJcbiAgICAgICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgc2VuZFNpZ251cE1haWwocmVxLmJvZHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNydlJlcy5tZXNzYWdlID0gXCJBIGNvbmZpcm1hdGlvbiBlbWFpbCBpcyBzZW50IHRvIHRoZSBlbWFpbC4gUGxlYXNlIHZlcmlmeSFcIlxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaChlKXtcclxuICAgICAgICAgICAgICAgICAgICBTZXJ2aWNlLmRlbGV0ZUN1c3RvbWVyUGVybWFuZW50KHtlbWFpbDogcmVxLmJvZHkuZW1haWx9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFcnJvciB3aGlsZSBzZW5kaW5nIGNvbmZpcm1hdGlvbiBlbWFpbC4gUGxlYXNlIHRyeSBhZ2FpbiFcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBkZWxldGUocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLmRlbGV0ZUN1c3RvbWVyKHJlcS5wYXJhbXMuaWQsIHtzdGF0ZTogZ2xvYmFsLnN0YXRlLCBkaXN0cmljdDogZ2xvYmFsLmRpc3RyaWN0LCB0YWx1azogZ2xvYmFsLnRhbHVrfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKHNydlJlcy5zdGF0dXNDb2RlKS5qc29uKHsgc3J2UmVzIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbn0iXX0=