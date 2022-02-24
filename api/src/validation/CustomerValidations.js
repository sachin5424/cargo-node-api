import { check } from '../settings/import';
import CustomerModel from '../data-base/models/customer';
import CustomerLocationModel from '../data-base/models/customerLocation';
import StateModel from '../data-base/models/state';
import DistrictModel from '../data-base/models/district';
import TalukModel from '../data-base/models/taluk';
import VehicleOwnerModel from '../data-base/models/vehicleOwner';


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

export const customerValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await CustomerModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch (e) {
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
            const result = await CustomerModel.findOne({ phoneNo: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A customer already exist with this phone number");
                    }
                } else {
                    throw new Error("A customer already exist with this phone number");
                }
            }
        }),

    check('email')
        .notEmpty().withMessage("The 'Email' field is required")
        .isEmail().withMessage("The 'Email' field is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await CustomerModel.findOne({ email: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A customer already exist with this email");
                    }
                } else {
                    throw new Error("A customer already exist with this email");
                }
            }
        }),

    check('password')
        .notEmpty().withMessage("The 'Password' field is required"),

    check('dob')
        .notEmpty().withMessage("The 'Date of Birth' field is required")
        .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Date of Birth' field is not valid"),

    check('photo')
        .notEmpty().withMessage("Photo is required")
        .isString().withMessage("Photo is not valid")
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Photo is not an image"),

    check('address')
        .notEmpty().withMessage("The 'Address' field is required")
        .isString().withMessage("The 'Address' field is not valid"),

    check('state')
        .notEmpty().withMessage("The 'State' field is required")
        .isString().withMessage("The 'State' field is not valid")
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

    check('zipcode')
        .notEmpty().withMessage("The 'Zipcode' field is required")
        .matches(/^[1-9]{1}[0-9]{5}$/).withMessage("The 'Zipcode' field is not valid"),

    check('isActive')
        .optional()
        .notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];

export const locationSearch = [
    check('customer')
        .notEmpty().withMessage("A customer is required")
        .custom(async (v) => {
            try {
                const r = await CustomerModel.findById(v);
                if (!r) {
                    throw new Error("Customer is not valid");
                }
            } catch (e) {
                throw new Error("Customer is not valid");
            }
        }),
];

export const locationValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await CustomerLocationModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('customer')
        .notEmpty().withMessage("Select a customer")
        .custom(async (v) => {
            try {
                const r = await CustomerModel.findById(v);
                if (!r) {
                    throw new Error("Customer not found");
                }
            } catch (e) {
                throw new Error("Customer does not exit. Please check or refresh");
            }
        }),

    check('name')
        .notEmpty().withMessage("The 'Name' field is required")
        .isString().withMessage("The 'Name' field is not valid"),

    check('latlong')
        .notEmpty().withMessage("The 'Latitude & Longitude' field is required")
        .isLatLong().withMessage("The 'Latitude & Longitude' field is not valid"),

];


export const customerResetPasswordValidation = [
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
