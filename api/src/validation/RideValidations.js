import { check } from '../settings/import';
import RideTypeModel from '../data-base/models/rideTypeModel';
import ServiceTypeModel from '../data-base/models/serviceType';

export const rideTypeValidation = [

    check('_id')
        // .optional()
        .notEmpty().withMessage("A new ride type can not be created")
        .custom(async (v)=>{
            try{
                const r = await RideTypeModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('serviceType')
        .notEmpty().withMessage("The 'Service Type' field is required")
        .custom(async (value, { req }) => {
            const result = await ServiceTypeModel.findById(value);
            if (!result) {
                throw new Error("Invalid service type");
            }
        }),

    check('name')
        .notEmpty().withMessage("The 'name' field is required")
        .isString().withMessage("The 'name' field is not valid"),


    // check('key')
    //     .notEmpty().withMessage("The 'key' field is required")
    //     .isSlug().withMessage("The 'key' field is not valid")
    //     .custom(async (value, { req }) => {
    //         const body = req.body;
    //         const result = await RideTypeModel.findOne({ isDeleted: false, key: value });
    //         if (result) {
    //             if (body._id) {
    //                 if (result._id != body._id) {
    //                     throw new Error("A type already exist with this key");
    //                 }
    //             } else {
    //                 throw new Error("A type already exist with this key");
    //             }
    //         }
    //     }),

    check('photo')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.photo) {
                    throw new Error("The 'Photo' field is required");
                }
            }
            return true;
        })
        .optional()
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Photo is not an image"),

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];
