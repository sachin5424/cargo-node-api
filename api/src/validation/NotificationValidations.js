import { check } from '../settings/import';
import NotificationModel from '../data-base/models/notification';

export const notificationValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await NotificationModel.findOne({_id: v});
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),
        
    check('to')
        .notEmpty().withMessage("The 'Send To' field is required")
        .isIn(['manyCustomers', 'manyDrivers', 'manyAdmins', 'allCustomers', 'allDrivers', 'allAdmins']).withMessage("The 'Send To' field is not valid"),

    check('content')
            .notEmpty().withMessage("The 'Content' field is required")
            .isString().withMessage("The 'Content' field is not valid"),

];