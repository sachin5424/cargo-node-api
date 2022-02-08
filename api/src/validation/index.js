import { vehicalCategorieValidation, updatedVehicalCategorieValidation } from './vehical.validations';
import { addMultiPermission, addPermission } from './model-permission';
const validationMessage = {
    required: "This feild is required",
    invalidEmail: "Invalid email addresss",
    invalidPassword: "Invalid email password",
};
export { validationMessage, vehicalCategorieValidation, updatedVehicalCategorieValidation, addMultiPermission, addPermission };
