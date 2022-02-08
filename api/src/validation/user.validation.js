import { check, param } from "express-validator";
import { UserModel, UserTokenModel } from "../data-base/index";
import { matchPassword } from "../utls/_helper";
const validationMessage = {
    required: "This feild is required",
    invalidEmail: "Invalid email addresss",
    invalidPassword: "Invalid email password",
};
const userRegisterValidation = [
    check('first_name').notEmpty().withMessage(validationMessage.required).isString(),
    check('last_name').notEmpty().withMessage(validationMessage.required).isString(),
    check('email').notEmpty().withMessage(validationMessage.required).isEmail().withMessage(validationMessage.invalidEmail).custom(async (value, { req }) => {
        return UserModel.findOne({ email: value }).then((email) => {
            if (email) {
                throw new Error('try unique email');
            }
        });
    }),
    check('password').notEmpty().withMessage(validationMessage.required).isString().withMessage(validationMessage.invalidPassword),
    check('confim_password').notEmpty().withMessage(validationMessage.required).isString().withMessage(validationMessage.required).custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
];
const userLoginValidation = [
    check('email').notEmpty().withMessage(validationMessage.required).isEmail().withMessage(validationMessage.required).custom(async (input) => {
        const data = await UserModel.findOne({ email: input, isActive: true });
        if (!data)
            throw Error('Email address not register');
        if (data.email_verfiy === false)
            throw new Error('Eamil address not verfiy');
    }),
    check('password').notEmpty().withMessage(validationMessage.required).isString().withMessage(validationMessage.invalidPassword).custom(async (input, { req }) => {
        try {
            const match = await matchPassword(req.body.email, input);
            if (match == false) {
                throw new Error('invalid user credentials');
            }
        }
        catch (err) {
            if (err) {
                throw new Error('invalid user credentials');
            }
        }
    }),
];
const userRefreshTokenValidation = [
    check('email').notEmpty().withMessage(validationMessage.required).isEmail().custom(async (input) => {
        return UserTokenModel.findOne({ email: input }).then((data) => {
            if (!data) {
                throw new Error('invalid user Refresh Token');
            }
        });
    }),
    check('refreshToken').notEmpty().withMessage(validationMessage.required).isString().custom(async (input, { req }) => {
        return UserTokenModel.findOne({ refreshToken: input, email: req.body.email }).then((data) => {
            if (!data) {
                throw new Error('invalid user Refresh Token');
            }
        });
    }),
];
const check_params = [
    param('id').notEmpty().withMessage('required param').custom(async (id) => {
        const data = await UserModel.findOne({ _id: id });
        if (!data) {
            throw new Error('Invalid param Id');
        }
    }),
];
export { userRegisterValidation, userLoginValidation, userRefreshTokenValidation, check_params };
