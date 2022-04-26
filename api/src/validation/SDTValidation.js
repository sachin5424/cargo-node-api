import { check } from '../settings/import';
import StateModel from '../data-base/models/state';
import DistrictModel from '../data-base/models/district';
import TalukModel from '../data-base/models/taluk';

export const stateValidation = [

    check('_id')
        .optional()
        .custom(async (v)=>{
            try{
                const r = await StateModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),


    check('name')
        .notEmpty().withMessage("The 'name' field is required")
        .isString().withMessage("The 'Name' field is not valid"),

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];


export const districtValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await DistrictModel.findOne({_id: v});//, isDeleted: false, ...getAdminFilter()});
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('name')
        .notEmpty().withMessage("The 'Name' field is required")
        .isString().withMessage("The 'Name' field is not valid"),

    check('state')
        .optional()
        .notEmpty().withMessage("'State' field is required")
        .custom(async (value) => {
            try {
                const result = await StateModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("'State' field is not valid");
            }
        }),

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];

export const talukValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await TalukModel.findOne({_id: v, isDeleted: false, ...getAdminFilter()});
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('name')
        .notEmpty().withMessage("The 'Name' field is required")
        .isString().withMessage("The 'Name' field is not valid"),

    check('district')
        .optional()
        .notEmpty().withMessage("'District' is required")
        .custom(async (value, {req}) => {
            try {
                const result = await DistrictModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
                req.body.state = result.state;
            } catch (e) {
                throw new Error("'District' is not valid");
            }
        }),

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];
