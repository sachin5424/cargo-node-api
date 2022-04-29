"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorResponse = void 0;
const ErrorResponse = {
  error: {
    code: 500,
    message: "server error try agin"
  },
  create: {
    code: 201,
    message: "create succefuly "
  },
  validation: {
    code: 422
  }
};
exports.ErrorResponse = ErrorResponse;