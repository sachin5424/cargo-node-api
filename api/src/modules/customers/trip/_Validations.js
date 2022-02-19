import { check } from '../../../settings/import';
import { tripCategorieModel } from '../../../data-base';
import DriverModel from '../../../data-base/models/driver';
import CustomerModel from '../../../data-base/models/customer';
import VehicleModel from '../../../data-base/models/vehicle';

export const customerValidation = [

    check('tripCategory')
        .notEmpty().withMessage("Something went wrong. Please try again!")
        .custom(async (value) => {
            try {
                const result = await tripCategorieModel.findById(value);
                if (!result) {
                    throw new Error("Something went wrong. Please try again!");
                }
            } catch (e) {
                throw new Error("Something went wrong. Please try again!");
            }
        }),

    check('driver')
        .notEmpty().withMessage("Something went wrong. Please try again!")
        .custom(async (value) => {
            try {
                const result = await DriverModel.findById(value);
                if (!result) {
                    throw new Error("Driver is not available. Please try again!");
                }
            } catch (e) {
                throw new Error("Driver is not available. Please try again!");
            }
        }),

    check('customer')
        .notEmpty().withMessage("Something went wrong. Please try again!")
        .custom(async (value) => {
            try {
                const result = await CustomerModel.findById(value);
                if (!result) {
                    throw new Error("Something went wrong. Please try again!");
                }
            } catch (e) {
                throw new Error("Something went wrong. Please try again!");
            }
        }),

    check('vehicle')
        .notEmpty().withMessage("Something went wrong. Please try again!")
        .custom(async (value) => {
            try {
                const result = await VehicleModel.findById(value);
                if (!result) {
                    throw new Error("Vehicle is not available. Please try again!");
                }
            } catch (e) {
                throw new Error("Vehicle is not available. Please try again!");
            }
        }),

    check('pickupLocation')
        .notEmpty().withMessage("The 'Last Name' field is required")
        .isString().withMessage("The 'Last Name' field is not valid"),

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
