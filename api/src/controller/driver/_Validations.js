import { check } from '../../settings/import';
import DriverModel from '../../data-base/models/driver';

export const driverValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v)=>{
            try{
                const r = await DriverModel.findById(v);
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
        .matches(/^[0-9]{9}$/).withMessage("The 'Phone Number' field is not valid"),

    check('dob')
        .notEmpty().withMessage("The 'Date of Birth' field is required")
        .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Date of Birth' field is not valid"),

    check('photo')
        .notEmpty().withMessage("Photo is required")
        .isString().withMessage("Photo is not valid")
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Photo is not an image"),

    check('drivingLicenceNumber')
        .notEmpty().withMessage("The 'Driving Licence Number' field is required")
        .isString().withMessage("The 'Driving Licence Number' field is must be a valid")
        .matches(/^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/).withMessage("'Driving Licence Number' is not valid"),
    
    check('drivingLicenceNumberExpiryDate')
        .notEmpty().withMessage("The 'Driving Licence Expiry Date' field is required")
        .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Driving Licence Expiry Date' field is not valid"),

    check('adharNo')
        .notEmpty().withMessage("The 'Adhar Number' field is required")
        .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/).withMessage("The 'Adhar Number' field is not valid"),
    
    check('panNo')
        .notEmpty().withMessage("The 'Pan Number' field is required")
        .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage("The 'Pan Number' field is not valid"),
    
    check('address')
        .notEmpty().withMessage("The 'Address' field is required")
        .isString().withMessage("The 'Address' field is not valid"),
    
    check('state')
        .notEmpty().withMessage("The 'State' field is required")
        .isString().withMessage("The 'State' field is not valid"),
    
    check('district')
        .notEmpty().withMessage("The 'District' field is required")
        .isString().withMessage("The 'District' field is not valid"),
    
    check('tehsil')
        .notEmpty().withMessage("The 'Tehsil' field is required")
        .isString().withMessage("The 'Tehsil' field is not valid"),
    
    check('pincode')
        .notEmpty().withMessage("The 'Pincode' field is required")
        .matches(/^[1-9]{1}[0-9]{5}$/).withMessage("The 'Pincode' field is not valid"),

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];
