import { check } from '../settings/import';
const validationMessage = {
    required: "This feild is required",
    invalidEmail: "Invalid email addresss",
    invalidPassword: "Invalid email password",
};
let vehicalCategorieValidation = [
    check('name').notEmpty().withMessage(validationMessage.required).isString(),
    check('icon').optional().notEmpty().withMessage(validationMessage.required).isString(),
    check('active').optional().notEmpty().withMessage(validationMessage.required).toBoolean(1 ? true : false)
];
let updatedVehicalCategorieValidation = [
    check('name').optional().notEmpty().withMessage(validationMessage.required).isString(),
    check('icon').optional().notEmpty().withMessage(validationMessage.required).isString(),
    check('active').optional().notEmpty().withMessage(validationMessage.required).isIn([0, 1, 2])
];
export { vehicalCategorieValidation, updatedVehicalCategorieValidation };
