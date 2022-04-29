"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formValidation = formValidation;

var _expressValidator = require("express-validator");

function formValidation(req, res, next) {
  const errors = (0, _expressValidator.validationResult)(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.msg,
      // errors: errors.errors
      errors: errors.array({
        onlyFirstError: true
      })
    });
  } else {
    next();
  }
}