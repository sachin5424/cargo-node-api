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

export const sendEmailValidation = [

    check('template')
        .notEmpty().withMessage("The 'Template' field is required")
        .custom(async (value, { req }) => {
            if (value === 'custom') {
                console.log('yes');
                if (!req.body?.subject) {
                    throw new Error("The 'Subject' field is required");
                }
                if (!req.body?.html) {
                    throw new Error("The 'Template Design' field is required");
                }
            }
        }),

    check('to')
        .notEmpty().withMessage("The 'Send To' field is required")
        .isIn(['manyCustomers', 'manyDrivers', 'manyAdmins', 'allCustomers', 'allDrivers', 'allAdmins', 'custom']).withMessage("The 'Send To' field is not valid.")
        .custom(async (value, { req }) => {
            if(!['allCustomers', 'allDrivers', 'allAdmins'].includes(value)){
                if(!req.body?.emailIds || (Array.isArray(req.body?.emailIds) && req.body?.emailIds.length<1) ){
                    throw new Error('At least one email id is required to send the email');
                }
            }
        }),

    // check('emailIds')
    //     .optional()
    //     .isArray().withMessage("Email ids are not valid"),

    check('emailIds.*')
        .isEmail().withMessage("Email ids are not valid1"),

];