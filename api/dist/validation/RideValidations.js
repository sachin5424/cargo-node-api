"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rideTypeValidation = void 0;

var _import = require("../settings/import");

var _rideTypeModel = _interopRequireDefault(require("../data-base/models/rideTypeModel"));

var _serviceType = _interopRequireDefault(require("../data-base/models/serviceType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rideTypeValidation = [(0, _import.check)('_id') // .optional()
.notEmpty().withMessage("A new ride type can not be created").custom(async v => {
  try {
    const r = await _rideTypeModel.default.findById(v);

    if (!r) {
      throw new Error("Data not found");
    }
  } catch (e) {
    throw new Error("This data does not exit. Please check or refresh");
  }
}), (0, _import.check)('serviceType').notEmpty().withMessage("The 'Service Type' field is required").custom(async (value, {
  req
}) => {
  const result = await _serviceType.default.findById(value);

  if (!result) {
    throw new Error("Invalid service type");
  }
}), (0, _import.check)('name').notEmpty().withMessage("The 'name' field is required").isString().withMessage("The 'name' field is not valid"), // check('key')
//     .notEmpty().withMessage("The 'key' field is required")
//     .isSlug().withMessage("The 'key' field is not valid")
//     .custom(async (value, { req }) => {
//         const body = req.body;
//         const result = await RideTypeModel.findOne({ isDeleted: false, key: value });
//         if (result) {
//             if (body._id) {
//                 if (result._id != body._id) {
//                     throw new Error("A type already exist with this key");
//                 }
//             } else {
//                 throw new Error("A type already exist with this key");
//             }
//         }
//     }),
(0, _import.check)('photo').custom((v, {
  req
}) => {
  if (!req.body._id) {
    if (!req.body.photo) {
      throw new Error("The 'Photo' field is required");
    }
  }

  return true;
}).optional().matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Photo is not an image"), (0, _import.check)('isActive').notEmpty().withMessage("The 'active' field is required").toBoolean(1 ? true : false)];
exports.rideTypeValidation = rideTypeValidation;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0aW9uL1JpZGVWYWxpZGF0aW9ucy5qcyJdLCJuYW1lcyI6WyJyaWRlVHlwZVZhbGlkYXRpb24iLCJub3RFbXB0eSIsIndpdGhNZXNzYWdlIiwiY3VzdG9tIiwidiIsInIiLCJSaWRlVHlwZU1vZGVsIiwiZmluZEJ5SWQiLCJFcnJvciIsImUiLCJ2YWx1ZSIsInJlcSIsInJlc3VsdCIsIlNlcnZpY2VUeXBlTW9kZWwiLCJpc1N0cmluZyIsImJvZHkiLCJfaWQiLCJwaG90byIsIm9wdGlvbmFsIiwibWF0Y2hlcyIsInRvQm9vbGVhbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBRU8sTUFBTUEsa0JBQWtCLEdBQUcsQ0FFOUIsbUJBQU0sS0FBTixFQUNJO0FBREosQ0FFS0MsUUFGTCxHQUVnQkMsV0FGaEIsQ0FFNEIsb0NBRjVCLEVBR0tDLE1BSEwsQ0FHWSxNQUFPQyxDQUFQLElBQVc7QUFDZixNQUFHO0FBQ0MsVUFBTUMsQ0FBQyxHQUFHLE1BQU1DLHVCQUFjQyxRQUFkLENBQXVCSCxDQUF2QixDQUFoQjs7QUFDQSxRQUFJLENBQUNDLENBQUwsRUFBUTtBQUNKLFlBQU0sSUFBSUcsS0FBSixDQUFVLGdCQUFWLENBQU47QUFDSDtBQUNKLEdBTEQsQ0FLRSxPQUFNQyxDQUFOLEVBQVE7QUFDTixVQUFNLElBQUlELEtBQUosQ0FBVSxrREFBVixDQUFOO0FBQ0g7QUFDSixDQVpMLENBRjhCLEVBZ0I5QixtQkFBTSxhQUFOLEVBQ0tQLFFBREwsR0FDZ0JDLFdBRGhCLENBQzRCLHNDQUQ1QixFQUVLQyxNQUZMLENBRVksT0FBT08sS0FBUCxFQUFjO0FBQUVDLEVBQUFBO0FBQUYsQ0FBZCxLQUEwQjtBQUM5QixRQUFNQyxNQUFNLEdBQUcsTUFBTUMscUJBQWlCTixRQUFqQixDQUEwQkcsS0FBMUIsQ0FBckI7O0FBQ0EsTUFBSSxDQUFDRSxNQUFMLEVBQWE7QUFDVCxVQUFNLElBQUlKLEtBQUosQ0FBVSxzQkFBVixDQUFOO0FBQ0g7QUFDSixDQVBMLENBaEI4QixFQXlCOUIsbUJBQU0sTUFBTixFQUNLUCxRQURMLEdBQ2dCQyxXQURoQixDQUM0Qiw4QkFENUIsRUFFS1ksUUFGTCxHQUVnQlosV0FGaEIsQ0FFNEIsK0JBRjVCLENBekI4QixFQThCOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxtQkFBTSxPQUFOLEVBQ0tDLE1BREwsQ0FDWSxDQUFDQyxDQUFELEVBQUk7QUFBRU8sRUFBQUE7QUFBRixDQUFKLEtBQWdCO0FBQ3BCLE1BQUksQ0FBQ0EsR0FBRyxDQUFDSSxJQUFKLENBQVNDLEdBQWQsRUFBbUI7QUFDZixRQUFJLENBQUNMLEdBQUcsQ0FBQ0ksSUFBSixDQUFTRSxLQUFkLEVBQXFCO0FBQ2pCLFlBQU0sSUFBSVQsS0FBSixDQUFVLCtCQUFWLENBQU47QUFDSDtBQUNKOztBQUNELFNBQU8sSUFBUDtBQUNILENBUkwsRUFTS1UsUUFUTCxHQVVLQyxPQVZMLENBVWEsK0JBVmIsRUFVOENqQixXQVY5QyxDQVUwRCx1QkFWMUQsQ0EvQzhCLEVBMkQ5QixtQkFBTSxVQUFOLEVBQ0lELFFBREosR0FDZUMsV0FEZixDQUMyQixnQ0FEM0IsRUFFS2tCLFNBRkwsQ0FFZSxJQUFJLElBQUosR0FBVyxLQUYxQixDQTNEOEIsQ0FBM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVjayB9IGZyb20gJy4uL3NldHRpbmdzL2ltcG9ydCc7XHJcbmltcG9ydCBSaWRlVHlwZU1vZGVsIGZyb20gJy4uL2RhdGEtYmFzZS9tb2RlbHMvcmlkZVR5cGVNb2RlbCc7XHJcbmltcG9ydCBTZXJ2aWNlVHlwZU1vZGVsIGZyb20gJy4uL2RhdGEtYmFzZS9tb2RlbHMvc2VydmljZVR5cGUnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJpZGVUeXBlVmFsaWRhdGlvbiA9IFtcclxuXHJcbiAgICBjaGVjaygnX2lkJylcclxuICAgICAgICAvLyAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiQSBuZXcgcmlkZSB0eXBlIGNhbiBub3QgYmUgY3JlYXRlZFwiKVxyXG4gICAgICAgIC5jdXN0b20oYXN5bmMgKHYpPT57XHJcbiAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBSaWRlVHlwZU1vZGVsLmZpbmRCeUlkKHYpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YSBub3QgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2goZSl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGRhdGEgZG9lcyBub3QgZXhpdC4gUGxlYXNlIGNoZWNrIG9yIHJlZnJlc2hcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuXHJcbiAgICBjaGVjaygnc2VydmljZVR5cGUnKVxyXG4gICAgICAgIC5ub3RFbXB0eSgpLndpdGhNZXNzYWdlKFwiVGhlICdTZXJ2aWNlIFR5cGUnIGZpZWxkIGlzIHJlcXVpcmVkXCIpXHJcbiAgICAgICAgLmN1c3RvbShhc3luYyAodmFsdWUsIHsgcmVxIH0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgU2VydmljZVR5cGVNb2RlbC5maW5kQnlJZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHNlcnZpY2UgdHlwZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG5cclxuICAgIGNoZWNrKCduYW1lJylcclxuICAgICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnbmFtZScgZmllbGQgaXMgcmVxdWlyZWRcIilcclxuICAgICAgICAuaXNTdHJpbmcoKS53aXRoTWVzc2FnZShcIlRoZSAnbmFtZScgZmllbGQgaXMgbm90IHZhbGlkXCIpLFxyXG5cclxuXHJcbiAgICAvLyBjaGVjaygna2V5JylcclxuICAgIC8vICAgICAubm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAna2V5JyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgLy8gICAgIC5pc1NsdWcoKS53aXRoTWVzc2FnZShcIlRoZSAna2V5JyBmaWVsZCBpcyBub3QgdmFsaWRcIilcclxuICAgIC8vICAgICAuY3VzdG9tKGFzeW5jICh2YWx1ZSwgeyByZXEgfSkgPT4ge1xyXG4gICAgLy8gICAgICAgICBjb25zdCBib2R5ID0gcmVxLmJvZHk7XHJcbiAgICAvLyAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFJpZGVUeXBlTW9kZWwuZmluZE9uZSh7IGlzRGVsZXRlZDogZmFsc2UsIGtleTogdmFsdWUgfSk7XHJcbiAgICAvLyAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgIC8vICAgICAgICAgICAgIGlmIChib2R5Ll9pZCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuX2lkICE9IGJvZHkuX2lkKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgdHlwZSBhbHJlYWR5IGV4aXN0IHdpdGggdGhpcyBrZXlcIik7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHR5cGUgYWxyZWFkeSBleGlzdCB3aXRoIHRoaXMga2V5XCIpO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSksXHJcblxyXG4gICAgY2hlY2soJ3Bob3RvJylcclxuICAgICAgICAuY3VzdG9tKCh2LCB7IHJlcSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghcmVxLmJvZHkuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlcS5ib2R5LnBob3RvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlICdQaG90bycgZmllbGQgaXMgcmVxdWlyZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgIC5tYXRjaGVzKC9kYXRhOmltYWdlXFwvW147XSs7YmFzZTY0W15cIl0rLykud2l0aE1lc3NhZ2UoXCJQaG90byBpcyBub3QgYW4gaW1hZ2VcIiksXHJcblxyXG4gICAgY2hlY2soJ2lzQWN0aXZlJykuXHJcbiAgICAgICAgbm90RW1wdHkoKS53aXRoTWVzc2FnZShcIlRoZSAnYWN0aXZlJyBmaWVsZCBpcyByZXF1aXJlZFwiKVxyXG4gICAgICAgIC50b0Jvb2xlYW4oMSA/IHRydWUgOiBmYWxzZSksXHJcbl07XHJcbiJdfQ==