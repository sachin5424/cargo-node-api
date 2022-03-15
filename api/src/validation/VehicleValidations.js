import { check } from '../settings/import';
import VehicleModel from '../data-base/models/vehicle';
import VehicleCategoryModel from '../data-base/models/vehicaleCategoryModel';
import ServiceTypeModel from '../data-base/models/serviceType';
import RideTypeModel from '../data-base/models/rideTypeModel';

export const vehicleCategoryValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await VehicleCategoryModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('name')
        .notEmpty().withMessage("The 'name' field is required")
        .isString().withMessage("The 'name' field is not valid"),


    check('slug')
        .notEmpty().withMessage("The 'slug' field is required")
        .isSlug().withMessage("The 'slug' field is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await VehicleCategoryModel.findOne({ isDeleted: false, slug: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A category already exist with this slug");
                    }
                } else {
                    throw new Error("A category already exist with this slug");
                }
            }
        }),

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

export const vehicleValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await VehicleModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('serviceType')
        .notEmpty().withMessage("The 'Service Type' field is required")
        .custom(async (value) => {

            try {
                const result = await ServiceTypeModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("Service Type is not valid");
            }
        }),

    check('rideTypes')
        .notEmpty().withMessage("The 'Ride Type' field is required")
        .isArray().withMessage("Ride Type is not valid")
        .custom(async (value) => {
            try {
                value?.forEach(async(v) => {
                    const result = await RideTypeModel.findById(v);
                    if (!result) {
                        throw new Error("Data not found");
                    }
                });
            } catch (e) {
                throw new Error("Ride Type is not valid");
            }
        }),

    check('vehicleCategory')
        .notEmpty().withMessage("The 'Vehicle Category' field is required")
        .custom(async (value) => {
            try {
                const result = await VehicleCategoryModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("Vehicle Category is not valid");
            }
        }),

    check('name')
        .notEmpty().withMessage("The 'name' field is required")
        .isString().withMessage("The 'name' field is not valid"),

    check('primaryPhoto')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.photo) {
                    throw new Error("The 'Primary Photo' field is required");
                }
            }
            return true;
        })
        .optional()
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Primary Photo is not an image"),

    check('vehicleNumber')
        .notEmpty().withMessage("The 'Vehicle Number' field is required")
        .isString().withMessage("The 'Vehicle Number' field is not valid"),

    check('availableSeats')
        .notEmpty().withMessage("The 'Available Seats' field is required")
        .isNumeric().withMessage("The 'Available Seats' field is must be a number"),

    check('isActive')
        .notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];
