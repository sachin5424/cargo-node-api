import { check } from '../settings/import';
import EmailTemplateModel from '../data-base/models/emailTemplate';

export const templateValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await EmailTemplateModel.findOne({_id: v});
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('subject')
        .notEmpty().withMessage("The 'Subject' field is required")
        .isString().withMessage("The 'Subject' field is not valid"),

    check('key')
        .notEmpty().withMessage("The 'key' field is required")
        .isSlug().withMessage("The 'key' field is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await EmailTemplateModel.findOne({ key: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A template already exist with this key");
                    }
                } else {
                    throw new Error("A template already exist with this key");
                }
            }
        }),

    check('html')
        .notEmpty().withMessage("The 'Template Code' field is required")
        .isString().withMessage("The 'Template Code' field is not valid"),

];