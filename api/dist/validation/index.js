"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "addMultiPermission", {
  enumerable: true,
  get: function () {
    return _modelPermission.addMultiPermission;
  }
});
Object.defineProperty(exports, "addPermission", {
  enumerable: true,
  get: function () {
    return _modelPermission.addPermission;
  }
});
Object.defineProperty(exports, "updatedVehicalCategorieValidation", {
  enumerable: true,
  get: function () {
    return _vehical.updatedVehicalCategorieValidation;
  }
});
exports.validationMessage = void 0;
Object.defineProperty(exports, "vehicalCategorieValidation", {
  enumerable: true,
  get: function () {
    return _vehical.vehicalCategorieValidation;
  }
});

var _vehical = require("./vehical.validations");

var _modelPermission = require("./model-permission");

const validationMessage = {
  required: "This feild is required",
  invalidEmail: "Invalid email addresss",
  invalidPassword: "Invalid email password"
};
exports.validationMessage = validationMessage;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWxpZGF0aW9uL2luZGV4LmpzIl0sIm5hbWVzIjpbInZhbGlkYXRpb25NZXNzYWdlIiwicmVxdWlyZWQiLCJpbnZhbGlkRW1haWwiLCJpbnZhbGlkUGFzc3dvcmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQSxNQUFNQSxpQkFBaUIsR0FBRztBQUN0QkMsRUFBQUEsUUFBUSxFQUFFLHdCQURZO0FBRXRCQyxFQUFBQSxZQUFZLEVBQUUsd0JBRlE7QUFHdEJDLEVBQUFBLGVBQWUsRUFBRTtBQUhLLENBQTFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdmVoaWNhbENhdGVnb3JpZVZhbGlkYXRpb24sIHVwZGF0ZWRWZWhpY2FsQ2F0ZWdvcmllVmFsaWRhdGlvbiB9IGZyb20gJy4vdmVoaWNhbC52YWxpZGF0aW9ucyc7XHJcbmltcG9ydCB7IGFkZE11bHRpUGVybWlzc2lvbiwgYWRkUGVybWlzc2lvbiB9IGZyb20gJy4vbW9kZWwtcGVybWlzc2lvbic7XHJcbmNvbnN0IHZhbGlkYXRpb25NZXNzYWdlID0ge1xyXG4gICAgcmVxdWlyZWQ6IFwiVGhpcyBmZWlsZCBpcyByZXF1aXJlZFwiLFxyXG4gICAgaW52YWxpZEVtYWlsOiBcIkludmFsaWQgZW1haWwgYWRkcmVzc3NcIixcclxuICAgIGludmFsaWRQYXNzd29yZDogXCJJbnZhbGlkIGVtYWlsIHBhc3N3b3JkXCIsXHJcbn07XHJcbmV4cG9ydCB7IHZhbGlkYXRpb25NZXNzYWdlLCB2ZWhpY2FsQ2F0ZWdvcmllVmFsaWRhdGlvbiwgdXBkYXRlZFZlaGljYWxDYXRlZ29yaWVWYWxpZGF0aW9uLCBhZGRNdWx0aVBlcm1pc3Npb24sIGFkZFBlcm1pc3Npb24gfTtcclxuIl19