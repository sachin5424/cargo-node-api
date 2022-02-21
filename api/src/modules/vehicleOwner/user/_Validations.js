import { check } from '../../../settings/import';
import VehicleOwnerModel from '../../../data-base/models/vehicleOwner';

export const customerLoginValidation = [

    check('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Provide a valid email")
        .custom(async (v) => {
            try {
                const r = await VehicleOwnerModel.findOne({email: v, isDeleted: false});
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("Email is not registered");
            }
        }),

    check('password')
        .notEmpty().withMessage("Password is required"),

];
