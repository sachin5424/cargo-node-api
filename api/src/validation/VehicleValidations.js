import { check } from '../settings/import';
import VehicleModel from '../data-base/models/vehicle';
import VehicleCategoryModel from '../data-base/models/vehicaleCategoryModel';
import ServiceTypeModel from '../data-base/models/serviceType';
import RideTypeModel from '../data-base/models/rideTypeModel';
import MakeModel from '../data-base/models/make';
import MakeModelModel from '../data-base/models/makeModel';
import ColorModel from '../data-base/models/color';
import StateModel from '../data-base/models/state';
import DistrictModel from '../data-base/models/district';
import TalukModel from '../data-base/models/taluk';

export const ColorValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await ColorModel.findById(v);
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


    check('code')
        .notEmpty().withMessage("The 'code' field is required")
        .isSlug().withMessage("The 'code' field is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await ColorModel.findOne({ isDeleted: false, code: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A color already exist with this code");
                    }
                } else {
                    throw new Error("A color already exist with this code");
                }
            }
        }),

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];

export const MakeValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await MakeModel.findById(v);
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


    check('key')
        .notEmpty().withMessage("The 'key' field is required")
        .isSlug().withMessage("The 'key' field is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await MakeModel.findOne({ isDeleted: false, key: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A make already exist with this key");
                    }
                } else {
                    throw new Error("A make already exist with this key");
                }
            }
        }),

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];

export const MakeModelValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await MakeModelModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('make')
        .notEmpty().withMessage("'Make' field is required")
        .custom(async (value) => {
            try {
                const result = await MakeModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("'Make' field is not valid");
            }
        }),

    check('name')
        .notEmpty().withMessage("The 'name' field is required")
        .isString().withMessage("The 'name' field is not valid"),


    check('key')
        .notEmpty().withMessage("The 'key' field is required")
        .isSlug().withMessage("The 'key' field is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await MakeModelModel.findOne({ isDeleted: false, key: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A make model already exist with this key");
                    }
                } else {
                    throw new Error("A make model already exist with this key");
                }
            }
        }),

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];

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

    check('make')
        .notEmpty().withMessage("The 'Make' field is required")
        .custom(async (value) => {
            try {
                const result = await MakeModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("Make is not valid");
            }
        }),

    check('model')
        .notEmpty().withMessage("The 'Model' field is required")
        .custom(async (value) => {
            try {
                const result = await MakeModelModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("Model is not valid");
            }
        }),

    check('color')
        .notEmpty().withMessage("The 'Color' field is required")
        .custom(async (value) => {
            try {
                const result = await ColorModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("Color is not valid");
            }
        }),

    check('manufacturingYear')
        .notEmpty().withMessage("The 'Manufacturing Year' field is required")
        .matches(/^[0-9]{4}$/).withMessage("The 'Manufacturing Year' field is not valid"),

    check('name')
        .notEmpty().withMessage("The 'name' field is required")
        .isString().withMessage("The 'name' field is not valid"),

    check('vehicleNumber')
        .notEmpty().withMessage("The 'Vehicle Number' field is required")
        .isString().withMessage("The 'Vehicle Number' field is not valid"),

    check('availableSeats')
        .optional()
        .isNumeric().withMessage("The 'Available Seats' field is must be a number")
        .custom(async (value, {req}) => {
            try {
                const ServiceType = await ServiceTypeModel.findById(req.body?.ServiceType);
                if (ServiceType?.key === 'taxi' && !value?.length) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("The 'Available Seats' field is required");
            }
        }),

    check('availableCapacity')
        .optional()
        .isNumeric().withMessage("The 'Available Capacity' field is must be a number")
        .custom(async (value, {req}) => {
            try {
                const ServiceType = await ServiceTypeModel.findById(req.body?.ServiceType);
                if (ServiceType?.key === 'cargo' && !value?.length) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("The 'Available Capacity' field is required");
            }
        }),

    check('state')
        .notEmpty().withMessage("The 'State' field is required")
        // .isString().withMessage("The 'State' field is not valid")
        .custom(async (value) => {
            try {
                const result = await StateModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("State is not valid");
            }
        }),

    check('district')
        .notEmpty().withMessage("The 'District' field is required")
        .isString().withMessage("The 'District' field is not valid")
        .custom(async (value) => {
            try {
                const result = await DistrictModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("District is not valid");
            }
        }),

    check('taluk')
        .notEmpty().withMessage("The 'Taluk' field is required")
        .isString().withMessage("The 'Taluk' field is not valid")
        .custom(async (value) => {
            try {
                const result = await TalukModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("Taluk is not valid");
            }
        }),

    check('primaryPhoto')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.primaryPhoto) {
                    throw new Error("The 'Primary Photo' field is required");
                }
            }
            return true;
        })
        .optional()
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Primary Photo is not an image"),

    check('otherPhotos')
        .optional()
        .isArray().withMessage("Other photo field is not valid")
        .custom((value) => {
            const temp = value?.find(v=>{
                return !v.match(/data:image\/[^;]+;base64[^"]+/)
            });
            if(temp?.length){
                throw new Error("Other Photo is not an image");
            } else{
                return true;
            }
        }),

    check('registrationNumber')
        .notEmpty().withMessage("The 'Registration Number' field is required")
        .isString().withMessage("The 'Registration Number' field is not valid"),

    check('registrationExpiryDate')
        .notEmpty().withMessage("The 'Registration Expiry Date' field is required")
        .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Registration Expiry Date' field is not valid"),

    check('registrationPhoto')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.registrationPhoto) {
                    throw new Error("The 'Registration Photo' field is required");
                }
            }
            return true;
        })
        .optional()
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Registration Photo is not an image"),

    
        
    check('insuranceNumber')
        .notEmpty().withMessage("The 'Insurance Number' field is required")
        .isString().withMessage("The 'Insurance Number' field is not valid"),

    check('insuranceExpiryDate')
        .notEmpty().withMessage("The 'Insurance Expirary Date' field is required")
        .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Insurance Expirary Date' field is not valid"),

    check('insurancePhoto')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.insurancePhoto) {
                    throw new Error("The 'Insurance Photo' field is required");
                }
            }
            return true;
        })
        .optional()
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Insurance Photo is not an image"),



    check('permitNumber')
        .notEmpty().withMessage("The 'Permit Number' field is required")
        .isString().withMessage("The 'Permit Number' field is not valid"),

    check('permitExpiryDate')
        .notEmpty().withMessage("The 'Permit Expirary Date' field is required")
        .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Permit Expirary Date' field is not valid"),

    check('permitPhoto')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.permitPhoto) {
                    throw new Error("The 'Permit Photo' field is required");
                }
            }
            return true;
        })
        .optional()
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Permit Photo is not an image"),



    check('pollutionNumber')
        .notEmpty().withMessage("The 'Pollution Number' field is required")
        .isString().withMessage("The 'Pollution Number' field is not valid"),

    check('pollutionExpiryDate')
        .notEmpty().withMessage("The 'Pollution Expirary Date' field is required")
        .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Pollution Expirary Date' field is not valid"),

    check('pollutionPhoto')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.pollutionPhoto) {
                    throw new Error("The 'Pollution Photo' field is required");
                }
            }
            return true;
        })
        .optional()
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Pollution Photo is not an image"),




    check('isActive')
        .notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];
