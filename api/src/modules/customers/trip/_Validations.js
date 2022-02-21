import { check } from '../../../settings/import';
import { tripCategorieModel } from '../../../data-base';
import DriverModel from '../../../data-base/models/driver';
import CustomerModel from '../../../data-base/models/customer';
import VehicleModel from '../../../data-base/models/vehicle';

export const tripListValidation = [

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
        .notEmpty().withMessage("Go back and fill pickup location")
        .matches(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/).withMessage("Pickup location is not valid. Please go back refill pickup location"),
    
    check('destinationLocation')
        .notEmpty().withMessage("Go back and fill destination location")
        .matches(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/).withMessage("Destination location is not valid. Please go back refill destination location"),

];
