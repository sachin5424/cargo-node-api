import { check, validationResult } from 'express-validator';
import customerModel from '../../../data-base/models/customer';
import bcrypt from 'bcryptjs'


const errorMessage = {
    required: 'The field is required',
    minLength: 'This field must be at least ',
    minField: 'characters',
    email: 'Please enter a valid email address',
    dateTime: 'Invalid date time format',

}
const validationMiddleware = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        }
        else {
            next()
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
}
const userRegisterValidation = [
    check('firstName').notEmpty().withMessage(errorMessage.required)
        .isLength({ min: 3 }).withMessage(errorMessage.minLength + ' 3 ' + errorMessage.minField),
    check('lastName').optional().notEmpty().withMessage(errorMessage.required)
        .isLength({ min: 3 }).withMessage(errorMessage.minLength + ' 3 ' + errorMessage.minField),
    check('phoneNo').notEmpty().withMessage(errorMessage.required)
        .isLength({ min: 10, max: 10 }).withMessage(errorMessage.minLength + ' 10 ' + errorMessage.minField).custom((value) => {
            return customerModel.findOne({ phoneNo: value, isDeleted: false }).then((data) => {
                if (data) {
                    if (data.phoneNo === value) {
                        throw new Error('Phone Number is already exist')
                    }
                }

            })
        }),
    check('email').notEmpty().withMessage(errorMessage.required).isEmail().withMessage(errorMessage.email).custom((value) => {
        return customerModel.findOne({ email: value, isDeleted: false }).then((data) => {
            if (data) {
                if (data.emailVerified == false) {
                    throw new Error('Email address is already exist please verify your email address')
                }

                if (data) {
                    throw new Error('Email address is already exist')
                }
            }

        })
    }),
    check('password').notEmpty().withMessage(errorMessage.required).isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,

    }).withMessage('Please enter a strong password'),
    check('confirm_password').notEmpty().withMessage(errorMessage.required).custom(async (value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('password and confirm password do not match');
        }
    })


];


const otpVerified = [
    check('phoneNo').notEmpty().withMessage(errorMessage.required)
        .isLength({ min: 10, max: 10 }).withMessage(errorMessage.minLength + ' 10 ' + errorMessage.minField).custom((value) => {
            return customerModel.findOne({ phoneNo: value, isDeleted: false }).then((data) => {
                if (!data) {
                    throw new Error('Phone number not match')
                }

            })
        }),
    check('otp').notEmpty().withMessage(errorMessage.required).isLength({ min: 4, max: 4 }).custom(async (value, { req }) => {
        return customerModel.findOne({ phoneNo: req.body.phoneNo, isDeleted: false, emailOtp: value }).then((data) => {
            if (!data) {
                throw new Error('Please enter a valid otp')
            }
        })
    })
]

const userLoginMobileNumberValidation = [
    check('phoneNo').notEmpty().withMessage(errorMessage.required)
        .isLength({ min: 10, max: 10 }).withMessage(errorMessage.minLength + ' 10 ' + errorMessage.minField).custom((value) => {
            return customerModel.findOne({ phoneNo: value, isDeleted: false }).then((data) => {
                if (!data) {
                    throw new Error('Phone number not match')
                }

            })
        }),
    check('password').notEmpty().withMessage(errorMessage.required).custom(async (value, { req }) => {
        return customerModel.findOne({ phoneNo: req.body.phoneNo, isDeleted: false }).then(async (data) => {
            if (data) {
                const password = await bcrypt.compare(req.body.password, data.password);
                if (!password) {
                    throw new Error('please enter a valid password')
                }
            }
        })
    })

]

const userForgetPasswordValidation = [
    check('phoneNo').notEmpty().withMessage(errorMessage.required)
        .isLength({ min: 10, max: 10 }).withMessage(errorMessage.minLength + ' 10 ' + errorMessage.minField).custom((value) => {
            return customerModel.findOne({ phoneNo: value, isDeleted: false }).then((data) => {
                if (!data) {
                    throw new Error('Phone number not match')
                }

            })
        }),
    check('email').optional().isEmail().withMessage(errorMessage.email).custom(async(value, { req })=>{
        return customerModel.findOne({email: value}).then((data)=>{
            if(!data){
                throw new Error('Email address is not exist')
            }
        })
    })
]
export {
    validationMiddleware, userRegisterValidation, otpVerified, userLoginMobileNumberValidation,userForgetPasswordValidation
}

