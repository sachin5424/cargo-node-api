import { check } from '../settings/import';
import { tripCategorieModel, VehicalCategorieModel} from '../data-base';
import VehicleTypeModel from '../data-base/models/vehicleType';
import VehicleModelModel from '../data-base/models/vehicleModel';
import VehicleModel from '../data-base/models/vehicle';
import DriverModel from '../data-base/models/driver';
import VehicleOwnerModel from '../data-base/models/vehicleOwner';
import { UserModel } from '../data-base';

export const vehicleOwnerLoginValidation = [
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
                const result = await VehicalCategorieModel.findById(value);
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

    check('owner')
        .notEmpty().withMessage("The 'owner' field is required")
        .custom(async (value) =>{

            try{
                const result = await VehicleOwnerModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("Owner is not valid");
            }

        }),

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

export const vehicleOwnerValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v)=>{
            try{
                const r = await VehicleOwnerModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('firstName')
        .notEmpty().withMessage("The 'First Name' field is required")
        .isString().withMessage("The 'First Name' field is not valid"),
    
    check('lastName')
        .notEmpty().withMessage("The 'Last Name' field is required")
        .isString().withMessage("The 'Last Name' field is not valid"),

    check('phoneNo')
        .notEmpty().withMessage("The 'Phone Number' field is required")
        .matches(/^[3-9]{1}[0-9]{9}$/).withMessage("The 'Phone Number' field is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await VehicleOwnerModel.findOne({ phoneNo: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A owner already exist with this phone number");
                    }
                } else {
                    throw new Error("A owner already exist with this phone number");
                }
            }
        }),
    
    check('email')
        .notEmpty().withMessage("The 'Email' field is required")
        .isEmail().withMessage("The 'Email' field is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await VehicleOwnerModel.findOne({ email: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A owner already exist with this email");
                    }
                } else {
                    throw new Error("A owner already exist with this email");
                }
            }
        }),

    check('password')
        .notEmpty().withMessage("The 'Password' field is required"),

    check('photo')
        .notEmpty().withMessage("The 'photo' is required")
        .isString().withMessage("The 'photo' is not valid")
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Photo is not an image"),
    
    check('isActive')
        .notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];

export const vehicleOwnerResetPasswordValidation = [
    check('password')
        .notEmpty().withMessage("Fill the password"),
    check('confirmPassword')
        .notEmpty().withMessage("Fill the confirm password")
        .custom(async (value, { req }) => {
            const password = req.body.password;
            const confirmPassword = req.body.confirmPassword;

            if(password !== confirmPassword){
                throw new Error("Both password does not match");
            }
        }),
];
