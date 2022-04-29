"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRegisterValidation = exports.userRefreshTokenValidation = exports.userLoginValidation = exports.check_params = void 0;

var _expressValidator = require("express-validator");

var _index = require("../data-base/index");

var _helper = require("../utls/_helper");

const validationMessage = {
  required: "This feild is required",
  invalidEmail: "Invalid email addresss",
  invalidPassword: "Invalid email password"
};
const userRegisterValidation = [(0, _expressValidator.check)('firstName').notEmpty().withMessage(validationMessage.required).isString(), (0, _expressValidator.check)('lastName').notEmpty().withMessage(validationMessage.required).isString(), (0, _expressValidator.check)('email').notEmpty().withMessage(validationMessage.required).isEmail().withMessage(validationMessage.invalidEmail).custom(async (value, {
  req
}) => {
  return _index.UserModel.findOne({
    email: value
  }).then(email => {
    if (email) {
      throw new Error('try unique email');
    }
  });
}), (0, _expressValidator.check)('password').notEmpty().withMessage(validationMessage.required).isString().withMessage(validationMessage.invalidPassword), (0, _expressValidator.check)('confim_password').notEmpty().withMessage(validationMessage.required).isString().withMessage(validationMessage.required).custom((value, {
  req
}) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }

  return true;
})];
exports.userRegisterValidation = userRegisterValidation;
const userLoginValidation = [(0, _expressValidator.check)('email').notEmpty().withMessage(validationMessage.required).isEmail().withMessage(validationMessage.required).custom(async input => {
  const data = await _index.UserModel.findOne({
    email: input,
    isActive: true
  });
  if (!data) throw Error('Email address not register');
  if (data.emailVerified === false) throw new Error('Eamil address not verfiy');
}), (0, _expressValidator.check)('password').notEmpty().withMessage(validationMessage.required).isString().withMessage(validationMessage.invalidPassword).custom(async (input, {
  req
}) => {
  try {
    const match = await (0, _helper.matchPassword)(req.body.email, input);

    if (match == false) {
      throw new Error('invalid user credentials');
    }
  } catch (err) {
    if (err) {
      throw new Error('invalid user credentials');
    }
  }
})];
exports.userLoginValidation = userLoginValidation;
const userRefreshTokenValidation = [(0, _expressValidator.check)('email').notEmpty().withMessage(validationMessage.required).isEmail().custom(async input => {
  return _index.UserTokenModel.findOne({
    email: input
  }).then(data => {
    if (!data) {
      throw new Error('invalid user Refresh Token');
    }
  });
}), (0, _expressValidator.check)('refreshToken').notEmpty().withMessage(validationMessage.required).isString().custom(async (input, {
  req
}) => {
  return _index.UserTokenModel.findOne({
    refreshToken: input,
    email: req.body.email
  }).then(data => {
    if (!data) {
      throw new Error('invalid user Refresh Token');
    }
  });
})];
exports.userRefreshTokenValidation = userRefreshTokenValidation;
const check_params = [(0, _expressValidator.param)('id').notEmpty().withMessage('required param').custom(async id => {
  const data = await _index.UserModel.findOne({
    _id: id
  });

  if (!data) {
    throw new Error('Invalid param Id');
  }
})];
exports.check_params = check_params;