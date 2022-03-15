import { check } from '../settings/import';
import { tripCategorieModel} from '../data-base';
import VehicalCategoryModel from '../data-base/models/vehicaleCategoryModel';
import VehicleTypeModel from '../data-base/models/vehicleType';
import VehicleModelModel from '../data-base/models/vehicleModel';
import VehicleModel from '../data-base/models/vehicle';
import DriverModel from '../data-base/models/driver';
import VehicleCategoryModel from '../data-base/models/vehicaleCategoryModel';

export const vehicleCategoryValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v)=>{
            try{
                const r = await VehicleCategoryModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch(e){
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

export const typeValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v)=>{
            try{
                const r = await VehicleTypeModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('name')
        .notEmpty().withMessage("The 'name' field is required")
        .isString().withMessage("The 'name' field is not valid"),

    check('icon')
        .optional()
        .notEmpty().withMessage("The 'icon' is required")
        .isString().withMessage("The 'icon' is not valid")
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Icon is not an image"),

    check('priceKM')
        .notEmpty().withMessage("The 'price per KM' field is required")
        .isNumeric().withMessage("The 'price per KM' field is must be a number"),

    check('tripCategories')
        .notEmpty().withMessage("The 'vehicle category' field is required")
        .isArray().withMessage("The 'vehicle category' field must be an array")
        .custom(async (value) => {
            let count = 0;
            const arrPromise = value?.map(async (v) => {
                try {
                    const result = await tripCategorieModel.findOne({ _id: v });
                    if (!result) {
                        throw new Error("Data not found");
                    }
                } catch (e) {
                    count++;
                }
            });
            await Promise.all(arrPromise);
            if (count > 0) {
                throw new Error(`${count} field${count > 1 ? 's are' : ' is'} not valid in trip category`)
            }
        }),

    check('vehicleCategory').
        notEmpty().withMessage("The 'vehicle category' field is required")
        .custom(async (value) =>{

            try{
                const result = await VehicalCategoryModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("Vehicle category is not valid");
            }

        }),

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];

export const modelValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v)=>{
            try{
                const r = await VehicleModelModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('name')
        .notEmpty().withMessage("The 'name' field is required")
        .isString().withMessage("The 'name' field is not valid"),

    check('description')
        .notEmpty().withMessage("The 'description' field is required")
        .isString().withMessage("The 'description' field is not valid"),

    check('vehicleType')
        .notEmpty().withMessage("The 'vehicle type' field is required")
        .custom(async (value) =>{
            try{
                const result = await VehicleTypeModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("Vehicle type is not valid");
            }
        }),

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];

export const vehicleValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v)=>{
            try{
                const r = await VehicleModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('name')
        .notEmpty().withMessage("The 'name' field is required")
        .isString().withMessage("The 'name' field is not valid"),

    check('photo')
        .notEmpty().withMessage("The 'photo' is required")
        .isString().withMessage("The 'photo' is not valid")
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Photo is not an image"),
    
    check('vehicleNumber')
        .notEmpty().withMessage("The 'Vehicle Number' field is required")
        .isString().withMessage("The 'Vehicle Number' field is not valid"),

    check('availableSeats')
        .notEmpty().withMessage("The 'Available Seats' field is required")
        .isNumeric().withMessage("The 'Available Seats' field is must be a number"),

    check('driver')
        .notEmpty().withMessage("The 'driver' field is required")
        .custom(async (value) =>{

            try{
                const result = await DriverModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("Driver is not valid");
            }

        }),

    check('vehicleType')
        .notEmpty().withMessage("The 'Vehicle Type' field is required")
        .custom(async (value) =>{

            try{
                const result = await VehicleTypeModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("Vehicle Type is not valid");
            }

        }),

    check('isActive')
        .notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];
