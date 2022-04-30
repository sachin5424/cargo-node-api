"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validationMiddleware = exports.userRegisterValidation = exports.userLoginMobileNumberValidation = exports.userForgetPasswordValidation = exports.profileUpdateValidation = exports.otpVerified = exports.chnagePasswordValidation = void 0;

var _expressValidator = require("express-validator");

var _customer = _interopRequireDefault(require("../../../data-base/models/customer"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const errorMessage = {
  required: 'The field is required',
  minLength: 'This field must be at least ',
  minField: 'characters',
  email: 'Please enter a valid email address',
  dateTime: 'Invalid date time format'
};

const validationMiddleware = (req, res, next) => {
  try {
    const errors = (0, _expressValidator.validationResult)(req);

    if (!errors.isEmpty()) {
      res.status(422).json({
        errors: errors.array()
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message
    });
  }
};

exports.validationMiddleware = validationMiddleware;
const userRegisterValidation = [(0, _expressValidator.check)('firstName').notEmpty().withMessage(errorMessage.required).isLength({
  min: 3
}).withMessage(errorMessage.minLength + ' 3 ' + errorMessage.minField), (0, _expressValidator.check)('lastName').optional().notEmpty().withMessage(errorMessage.required).isLength({
  min: 3
}).withMessage(errorMessage.minLength + ' 3 ' + errorMessage.minField), (0, _expressValidator.check)('phoneNo').notEmpty().withMessage(errorMessage.required).isLength({
  min: 10,
  max: 10
}).withMessage(errorMessage.minLength + ' 10 ' + errorMessage.minField).custom(value => {
  return _customer.default.findOne({
    phoneNo: value,
    isDeleted: false
  }).then(data => {
    if (data) {
      if (data.phoneNo === value) {
        throw new Error('Phone Number is already exist');
      }
    }
  });
}), (0, _expressValidator.check)('email').notEmpty().withMessage(errorMessage.required).isEmail().withMessage(errorMessage.email).custom(value => {
  return _customer.default.findOne({
    email: value,
    isDeleted: false
  }).then(data => {
    if (data) {
      if (data.emailVerified == false) {
        throw new Error('Email address is already exist please verify your email address');
      }

      if (data) {
        throw new Error('Email address is already exist');
      }
    }
  });
}), (0, _expressValidator.check)('password').notEmpty().withMessage(errorMessage.required).isStrongPassword({
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1
}).withMessage('Please enter a strong password'), (0, _expressValidator.check)('confirm_password').notEmpty().withMessage(errorMessage.required).custom(async (value, {
  req
}) => {
  if (value !== req.body.password) {
    throw new Error('password and confirm password do not match');
  }
})];
exports.userRegisterValidation = userRegisterValidation;
const otpVerified = [(0, _expressValidator.check)('phoneNo').notEmpty().withMessage(errorMessage.required).isLength({
  min: 10,
  max: 10
}).withMessage(errorMessage.minLength + ' 10 ' + errorMessage.minField).custom(value => {
  return _customer.default.findOne({
    phoneNo: value,
    isDeleted: false
  }).then(data => {
    if (!data) {
      throw new Error('Phone number not match');
    }
  });
}), (0, _expressValidator.check)('otp').notEmpty().withMessage(errorMessage.required).isLength({
  min: 4,
  max: 4
}).custom(async (value, {
  req
}) => {
  return _customer.default.findOne({
    phoneNo: req.body.phoneNo,
    isDeleted: false,
    emailOtp: value
  }).then(data => {
    if (!data) {
      throw new Error('Please enter a valid otp');
    }
  });
})];
exports.otpVerified = otpVerified;
const userLoginMobileNumberValidation = [(0, _expressValidator.check)('phoneNo').notEmpty().withMessage(errorMessage.required).isLength({
  min: 10,
  max: 10
}).withMessage(errorMessage.minLength + ' 10 ' + errorMessage.minField).custom(value => {
  return _customer.default.findOne({
    phoneNo: value,
    isDeleted: false
  }).then(data => {
    if (!data) {
      throw new Error('Phone number not match');
    }
  });
}), (0, _expressValidator.check)('password').notEmpty().withMessage(errorMessage.required).custom(async (value, {
  req
}) => {
  return _customer.default.findOne({
    phoneNo: req.body.phoneNo,
    isDeleted: false
  }).then(async data => {
    if (data) {
      const password = await _bcryptjs.default.compare(req.body.password, data.password);

      if (!password) {
        throw new Error('please enter a valid password');
      }
    }
  });
})];
exports.userLoginMobileNumberValidation = userLoginMobileNumberValidation;
const userForgetPasswordValidation = [(0, _expressValidator.check)('phoneNo').notEmpty().withMessage(errorMessage.required).isLength({
  min: 10,
  max: 10
}).withMessage(errorMessage.minLength + ' 10 ' + errorMessage.minField).custom(value => {
  return _customer.default.findOne({
    phoneNo: value,
    isDeleted: false
  }).then(data => {
    if (!data) {
      throw new Error('Phone number not match');
    }
  });
}), (0, _expressValidator.check)('email').optional().isEmail().withMessage(errorMessage.email).custom(async (value, {
  req
}) => {
  return _customer.default.findOne({
    email: value
  }).then(data => {
    if (!data) {
      throw new Error('Email address is not exist');
    }
  });
})]; // old: payload.old,
// newPassword: payload.newPassword,
// confirmPassword: payload.confirmPassword

exports.userForgetPasswordValidation = userForgetPasswordValidation;
const chnagePasswordValidation = [(0, _expressValidator.check)('phoneNo').notEmpty().withMessage(errorMessage.required).isLength({
  min: 10,
  max: 10
}).withMessage(errorMessage.minLength + ' 10 ' + errorMessage.minField).custom(async value => {
  return _customer.default.findOne({
    phoneNo: value,
    isDeleted: false
  }).then(data => {
    if (!data) {
      throw new Error('Phone number not match');
    }
  });
}), (0, _expressValidator.check)('old_password').notEmpty().withMessage("This field is required").custom(async (value, {
  req
}) => {
  return _customer.default.findOne({
    phoneNo: req.body.phoneNo
  }).then(async data => {
    console.log(data, "???");

    if (!data) {
      throw new Error('Password not match');
    }

    if (data) {
      const password = await _bcryptjs.default.compare(value, data.password);
      console.log(password, "password");

      if (!password) {
        throw new Error('please enter a valid password');
      }
    } // if()

  });
}), (0, _expressValidator.check)('password').notEmpty().withMessage(errorMessage.required).isStrongPassword({
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1
}).withMessage('Please enter a strong password'), (0, _expressValidator.check)('confirm_password').notEmpty().withMessage(errorMessage.required).custom(async (value, {
  req
}) => {
  if (value !== req.body.password) {
    throw new Error('password and confirm password do not match');
  }
})];
exports.chnagePasswordValidation = chnagePasswordValidation;
const profileUpdateValidation = [(0, _expressValidator.check)('phoneNo').notEmpty().withMessage(errorMessage.required).isLength({
  min: 10,
  max: 10
}).withMessage(errorMessage.minLength + ' 10 ' + errorMessage.minField).custom(async (value, {
  req
}) => {
  return _customer.default.findOne({
    _id: {
      $ne: req.userId
    },
    phoneNo: value,
    isDeleted: false
  }).then(data => {
    if (data) {
      throw new Error('Phone number already exists');
    }
  });
}), (0, _expressValidator.check)('email').notEmpty().withMessage(errorMessage.required).isEmail().withMessage(errorMessage.email).custom(async (value, {
  req
}) => {
  const data = await _customer.default.findOne({
    _id: {
      $ne: req.userId
    },
    email: value
  });

  if (data) {
    throw new Error('email  already exists');
  }
}), (0, _expressValidator.check)('gender').notEmpty().withMessage(errorMessage.required).isIn(['male', 'female', 'other'])];
exports.profileUpdateValidation = profileUpdateValidation;