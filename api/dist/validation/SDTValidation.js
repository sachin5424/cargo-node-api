"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.talukValidation = exports.stateValidation = exports.districtValidation = void 0;

var _import = require("../settings/import");

var _state = _interopRequireDefault(require("../data-base/models/state"));

var _district = _interopRequireDefault(require("../data-base/models/district"));

var _taluk = _interopRequireDefault(require("../data-base/models/taluk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const stateValidation = [(0, _import.check)('_id').optional().custom(async v => {
  try {
    const r = await _state.default.findById(v);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'name' field is required").isString().withMessage("The 'Name' field is not valid"), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.stateValidation = stateValidation;
const districtValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _district.default.findOne({
      _id: v
    }); //, isDeleted: false, ...getAdminFilter()});

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'Name' field is required").isString().withMessage("The 'Name' field is not valid"), (0, _import.check)('state').optional().notEmpty().withMessage("'State' field is required").custom(async value => {
  try {
    const result = await _state.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("'State' field is not valid");
  }
}), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.districtValidation = districtValidation;
const talukValidation = [(0, _import.check)('_id').optional().notEmpty().withMessage("Provide / Select a valid data").custom(async v => {
  try {
    const r = await _taluk.default.findOne(_objectSpread({
      _id: v,
      isDeleted: false
    }, getAdminFilter()));

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'Name' field is required").isString().withMessage("The 'Name' field is not valid"), (0, _import.check)('state').optional().notEmpty().withMessage("'State' field is required").custom(async value => {
  try {
    const result = await _state.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("'State' field is not valid");
  }
}), (0, _import.check)('district').optional().notEmpty().withMessage("'District' is required").custom(async (value, {
  req
}) => {
  try {
    const result = await _district.default.findById(value);

    if (!result) {
      throw new Error("Data not found");
    }

    req.body.state = result.state;
  } catch (e) {
    throw new Error("'District' is not valid");
  }
}), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.talukValidation = talukValidation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0aW9uL1NEVFZhbGlkYXRpb24uanMiXSwibmFtZXMiOlsic3RhdGVWYWxpZGF0aW9uIiwib3B0aW9uYWwiLCJjdXN0b20iLCJ2IiwiciIsIlN0YXRlTW9kZWwiLCJmaW5kQnlJZCIsIkVycm9yIiwiZSIsIm5vdEVtcHR5Iiwid2l0aE1lc3NhZ2UiLCJpc1N0cmluZyIsInRvQm9vbGVhbiIsImRpc3RyaWN0VmFsaWRhdGlvbiIsIkRpc3RyaWN0TW9kZWwiLCJmaW5kT25lIiwiX2lkIiwidmFsdWUiLCJyZXN1bHQiLCJ0YWx1a1ZhbGlkYXRpb24iLCJUYWx1a01vZGVsIiwiaXNEZWxldGVkIiwiZ2V0QWRtaW5GaWx0ZXIiLCJyZXEiLCJib2R5Iiwic3RhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVPLE1BQU1BLGVBQWUsR0FBRyxDQUUzQixtQkFBTSxLQUFOLEVBQ0tDLFFBREwsR0FFS0MsTUFGTCxDQUVZLE1BQU9DLENBQVAsSUFBVztBQUNmLE1BQUc7QUFDQyxVQUFNQyxDQUFDLEdBQUcsTUFBTUMsZUFBV0MsUUFBWCxDQUFvQkgsQ0FBcEIsQ0FBaEI7O0FBQ0EsUUFBSSxDQUFDQyxDQUFMLEVBQVE7QUFDSixZQUFNLElBQUlHLEtBQUosQ0FBVSxnQkFBVixDQUFOO0FBQ0g7QUFDSixHQUxELENBS0UsT0FBTUMsQ0FBTixFQUFRO0FBQ04sVUFBTSxJQUFJRCxLQUFKLENBQVUsa0RBQVYsQ0FBTjtBQUNIO0FBQ0osQ0FYTCxDQUYyQixFQWdCM0IsbUJBQU0sTUFBTixFQUNLRSxRQURMLEdBQ2dCQyxXQURoQixDQUM0Qiw4QkFENUIsRUFFS0MsUUFGTCxHQUVnQkQsV0FGaEIsQ0FFNEIsK0JBRjVCLENBaEIyQixFQW9CM0IsbUJBQU0sVUFBTixFQUNJRCxRQURKLEdBQ2VDLFdBRGYsQ0FDMkIsZ0NBRDNCLEVBRUtFLFNBRkwsQ0FFZSxJQUFJLElBQUosR0FBVyxLQUYx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QUVLUSxRQUZMLEdBRWdCQyxXQUZoQixDQUU0Qix3QkFGNUIsRUFHS1IsTUFITCxDQUdZLE9BQU9lLEtBQVAsRUFBYztBQUFDTSxFQUFBQTtBQUFELENBQWQsS0FBd0I7QUFDNUIsTUFBSTtBQUNBLFVBQU1MLE1BQU0sR0FBRyxNQUFNSixrQkFBY1IsUUFBZCxDQUF1QlcsS0FBdkIsQ0FBckI7O0FBQ0EsUUFBSSxDQUFDQyxNQUFMLEVBQWE7QUFDVCxZQUFNLElBQUlYLEtBQUosQ0FBVSxnQkFBVixDQUFOO0FBQ0g7O0FBQ0RnQixJQUFBQSxHQUFHLENBQUNDLElBQUosQ0FBU0MsS0FBVCxHQUFpQlAsTUFBTSxDQUFDTyxLQUF4QjtBQUNILEdBTkQsQ0FNRSxPQUFPakIsQ0FBUCxFQUFVO0FBQ1IsVUFBTSxJQUFJRCxLQUFKLENBQVUseUJBQVYsQ0FBTjtBQUNIO0FBQ0osQ0FiTCxDQWxDMkIsRUFpRDNCLG1CQUFNLFVBQU4sRUFDSUUsUUFESixHQUNlQyxXQURmLENBQzJCLGdDQUQzQixFQUVLRSxTQUZMLENBRWUsSUFBSSxJQUFKLEdBQVcsS0FGMUIsQ0FqRDJCLENBQXhCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2sgfSBmcm9tICcuLi9zZXR0aW5ncy9pbXBvcnQnO1xyXG5pbXBvcnQgU3RhdGVNb2RlbCBmcm9tICcuLi9kYXRhLWJhc2UvbW9kZWxzL3N0YXRlJztcclxuaW1wb3J0IERpc3RyaWN0TW9kZWwgZnJvbSAnLi4vZGF0YS1iYXNlL21vZGVscy9kaXN0cmljdCc7XHJcbmltcG9ydCBUYWx1a01vZGVsIGZyb20gJy4uL2RhdGEtYmFzZS9tb2RlbHMvdGFsdWsnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0YXRlVmFsaWRhdGlvbiA9IFtcclxuXHJcbiAgICBjaGVjaygnX2lkJylcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHYpPT57XHJcbiAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBTdGF0ZU1vZGVsLmZpbmRCeUlkKHYpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2goZSl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGRhdGEgZG9lcyBub3QgZXhpdC4gUGxlYXNlIGNoZWNrIG9yIHJlZnJlc2hcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcblxyXG4gICAgY2hlY2soJ25hbWUnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICduYW1lJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC5pc1N0cmluZygpLndpdGhNZXNzYWdlKFwiVGhlICdOYW1lJyBmaWVsZCBpcyBub3QgdmFsaWRcIiksXHJcblxyXG4gICAgY2hlY2soJ2lzQWN0aXZlJykuXHJcbiAgICAgICAgbm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnYWN0aXZlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC50b0Jvb2xlYW4oMSA/IHRydWUgOiBmYWxzZSksXHJcbl07XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGRpc3RyaWN0VmFsaWRhdGlvbiA9IFtcclxuXHJcbiAgICBjaGVjaygnX2lkJylcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiUHJvdmlkZSAvIFNlbGVjdCBhIHZhbGlkIGRhdGFcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgRGlzdHJpY3RNb2RlbC5maW5kT25lKHtfaWQ6IHZ9KTsvLywgaXNEZWxldGVkOiBmYWxzZSwgLi4uZ2V0QWRtaW5GaWx0ZXIoKX0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgZGF0YSBkb2VzIG5vdCBleGl0LiBQbGVhc2UgY2hlY2sgb3IgcmVmcmVzaFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCduYW1lJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnTmFtZScgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAuaXNTdHJpbmcoKS53aXRoTWVzc2FnZShcIlRoZSAnTmFtZScgZmllbGQgaXMgbm90IHZhbGlkXCIpLFxyXG5cclxuICAgIGNoZWNrKCdzdGF0ZScpXHJcbiAgICAgICAgLm9wdGlvbmFsKClcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIidTdGF0ZScgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgU3RhdGVNb2RlbC5maW5kQnlJZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGEgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInU3RhdGUnIGZpZWxkIGlzIG5vdCB2YWxpZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCdpc0FjdGl2ZScpLlxyXG4gICAgICAgIG5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ2FjdGl2ZScgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAudG9Cb29sZWFuKDEgPyB0cnVlIDogZmFsc2UpLFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRhbHVrVmFsaWRhdGlvbiA9IFtcclxuXHJcbiAgICBjaGVjaygnX2lkJylcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiUHJvdmlkZSAvIFNlbGVjdCBhIHZhbGlkIGRhdGFcIilcclxuICAgICAgICAuY3VzdG9tKGFzeW5jICh2KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgVGFsdWtNb2RlbC5maW5kT25lKHtfaWQ6IHYsIGlzRGVsZXRlZDogZmFsc2UsIC4uLmdldEFkbWluRmlsdGVyKCl9KTtcclxuICAgICAgICAgICAgICAgIGlmICghcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGEgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGRhdGEgZG9lcyBub3QgZXhpdC4gUGxlYXNlIGNoZWNrIG9yIHJlZnJlc2hcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnbmFtZScpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCJUaGUgJ05hbWUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmlzU3RyaW5nKCkud2l0aE1lc3NhZ2UoXCJUaGUgJ05hbWUnIGZpZWxkIGlzIG5vdCB2YWxpZFwiKSxcclxuXHJcbiAgICBjaGVjaygnc3RhdGUnKVxyXG4gICAgICAgIC5vcHRpb25hbCgpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCInU3RhdGUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFN0YXRlTW9kZWwuZmluZEJ5SWQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ1N0YXRlJyBmaWVsZCBpcyBub3QgdmFsaWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnZGlzdHJpY3QnKVxyXG4gICAgICAgIC5vcHRpb25hbCgpXHJcbiAgICAgICAgLm5vdEVtcHR5KCkud2l0aE1lc3NhZ2UoXCInRGlzdHJpY3QnIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUsIHtyZXF9KSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBEaXN0cmljdE1vZGVsLmZpbmRCeUlkKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXEuYm9keS5zdGF0ZSA9IHJlc3VsdC5zdGF0ZTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ0Rpc3RyaWN0JyBpcyBub3QgdmFsaWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnaXNBY3RpdmUnKS5cclxuICAgICAgICBub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdhY3RpdmUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLnRvQm9vbGVhbigxID8gdHJ1ZSA6IGZhbHNlKSxcclxuXTtcclxuIl19