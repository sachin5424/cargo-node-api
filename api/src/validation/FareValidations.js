import { check } from '../settings/import';
import RideTypeModel from '../data-base/models/rideTypeModel';
import FareManagementModel from '../data-base/models/fareManagement';
import StateModel from '../data-base/models/state';
import DistrictModel from '../data-base/models/district';
import TalukModel from '../data-base/models/taluk';
import VehicleCategoryModel from '../data-base/models/vehicaleCategoryModel';

export const fareManagementValidations = [

    check('_id')
        .optional()
        .custom(async (v)=>{
            try{
                const r = await FareManagementModel.findById(v);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch(e){
                throw new Error("This data does not exit. Please check or refresh");
            }
        }),

    check('rideType')
        .notEmpty().withMessage("The 'Ride Type' field is required")
        .custom(async (value, {req}) => {
            const result = await RideTypeModel.findById(value);
            if (!result) {
                throw new Error("Invalid ride type");
            } else{
                req.body.serviceType = result.serviceType;
            }
        }),

    check('vehicleCategory')
        .notEmpty().withMessage("The 'Vehicle Category' field is required")
        .custom(async (value) => {
            const result = await VehicleCategoryModel.findById(value);
            if (!result) {
                throw new Error("Invalid vehicle category");
            }
        }),


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

    check('taluk')
        .optional()
        .notEmpty().withMessage("'Taluk' field is required")
        .custom(async (value, {req}) => {
            try {
                const result = await TalukModel.findById(value);
                if (!result) {
                    throw new Error("Data not found");
                }
                req.body.district = result.district;
                const resultDistrict = await DistrictModel.findById(result.district);
                req.body.state = resultDistrict.state;
                
            } catch (e) {
                throw new Error("'Taluk' field is not valid");
            }
        }),

    check('baseFare')
        .notEmpty().withMessage("The 'Base Fare' field is required")
        .isNumeric().withMessage("The 'Base Fare' field must be numeric"),

    check('bookingFare')
        .notEmpty().withMessage("The 'Booking Fare' field is required")
        .isNumeric().withMessage("The 'Booking Fare' field must be numeric"),

    check('perMinuteFare')
        .notEmpty().withMessage("The 'Per Minute Fare' field is required")
        .isNumeric().withMessage("The 'Per Minute Fare' field must be numeric"),

    check('cancelCharge')
        .notEmpty().withMessage("The 'Cancel Charge' field is required")
        .isNumeric().withMessage("The 'Cancel Charge' field must be numeric"),

    check('waitingCharge')
        .notEmpty().withMessage("The 'Waiting Charge' field is required")
        .isNumeric().withMessage("The 'Waiting Charge' field must be numeric"),

    check('adminCommissionType')
        .notEmpty().withMessage("The 'Admin Commission Type' field is required")
        .isIn(['flat', 'percentage']).withMessage("The 'Admin Commission Type' field is not valid"),

    check('adminCommissionValue')
        .notEmpty().withMessage("The 'Admin Commission Value' field is required")
        .isNumeric().withMessage("The 'Admin Commission Value' field must be numeric"),

    // check('perKMCharges')
    //     .custom(async (value, {req}) => {
    //         const result = await RideTypeModel.findById(req.body.rideType);
    //         if (!result) {
    //             throw new Error("Invalid ride type");
    //         } else if( ["taxi-pickup-drop", "taxi-rentals", "cargo-daily-ride", "cargo-rentals"].includes(result.key) ){
    //             if(!value){
    //                 throw new Error("Per KM Charges are required");
    //             } else if(!Array.isArray(value)){
    //                 throw new Error("Per KM Charges are not valid");
    //             } else{
    //                 value.forEach((v, i) => {
    //                     console.log(i === 0 && (v?.maxKM * 1 <= 0 || !v?.chages));
    //                     console.log("i === 0", i === 0);
    //                     console.log("(v?.maxKM * 1 <= 0 || !v?.chages)", (v?.maxKM * 1 <= 0 || !v?.chages));
    //                     console.log("i", typeof i, i);
    //                     console.log("parseFloat(v?.maxKM * 1)", typeof parseFloat(v?.maxKM * 1), parseFloat(v?.maxKM * 1));
    //                     console.log("!v?.chages", typeof !v?.chages, !v?.chages);
    //                     if(i === 0 && (parseFloat(v?.maxKM * 1) <= 0 || !v?.chages)){
    //                         throw new Error("All maxKM & charges of 'Per KM Charges' must be valid");
    //                     } else if(i !== 0 && (parseFloat(v?.maxKM * 1) > parseFloat(value[i].maxKM * 1) || !v?.chages)){
    //                         throw new Error("All maxKM & charges of 'Per KM Charges' must be valid");
    //                     }
    //                 });
    //             }
    //         }
    //     }),

];
