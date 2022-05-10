import { check } from '../settings/import';
import DriverModel from '../data-base/models/driver';
import StateModel from '../data-base/models/state';
import DistrictModel from '../data-base/models/district';
import TalukModel from '../data-base/models/taluk';
import { getAdminFilter, clearSearch } from '../utls/_helper';


export const driverLoginValidation = [
    check('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Provide a valid email")
        .custom(async (v) => {
            try {
                const r = await DriverModel.findOne({email: v, isDeleted: false});
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


export const driverValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v, {req}) => {
            try {
                const permissionFilter = cuser.type == 'vehicleOwner' ? { owner: cuser._id } : { ...getAdminFilter() };
                const search = { _id: v, isDeleted: false, ...permissionFilter };
                clearSearch(search);

                const r = await DriverModel.findOne(search);
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

    // check('driverId')
    //     .notEmpty().withMessage("The 'Driver ID' field is required")
    //     .custom(async (value, { req }) => {
    //         const body = req.body;
    //         const result = await DriverModel.findOne({ driverId: value });
    //         if (result) {
    //             if (body._id) {
    //                 if (result._id != body._id) {
    //                     throw new Error("A driver already exist with this Driver ID");
    //                 }
    //             } else {
    //                 throw new Error("A driver already exist with this Driver ID");
    //             }
    //         }
    //     }),

    check('phoneNo')
        .notEmpty().withMessage("The 'Phone Number' field is required")
        .matches(/^[3-9]{1}[0-9]{9}$/).withMessage("The 'Phone Number' field is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await DriverModel.findOne({ phoneNo: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A driver already exist with this phone number");
                    }
                } else {
                    throw new Error("A driver already exist with this phone number");
                }
            }
        }),

    check('email')
        .notEmpty().withMessage("The 'Email' field is required")
        .isEmail().withMessage("The 'Email' field is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await DriverModel.findOne({ email: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A driver already exist with this email");
                    }
                } else {
                    throw new Error("A driver already exist with this email");
                }
            }
        }),
    
    check('userName')
        .notEmpty().withMessage("The 'User Name' field is required")
        .isSlug().withMessage("User Name field must not contain any special charecter except '-'")
        .custom(async (value, { req }) => {
            req.body.userName = req.body.userName.toLowerCase().replace(/[^a-z0-9 _-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
            const body = req.body;
            const result = await DriverModel.findOne({ userName: body.userName });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A driver already exist with this user name");
                    }
                } else {
                    throw new Error("A driver already exist with this user name");
                }
            }
        }),
    
    check('gender')
        .notEmpty().withMessage("The 'Gender' field is required")
        .isIn(['male', 'female', 'other']).withMessage('This Gender is not valid'),

    check('password')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.password) {
                    throw new Error("The 'Password' field is required");
                }
            }
            return true;
        }),

    check('dob')
        .notEmpty().withMessage("The 'Date of Birth' field is required")
        .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Date of Birth' field is not valid"),

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

    check('drivingLicenceNumber')
        .notEmpty().withMessage("The 'Driving Licence Number' field is required")
        .isString().withMessage("The 'Driving Licence Number' field is must be a valid")
        // .matches(/^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/).withMessage("'Driving Licence Number' is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await DriverModel.findOne({ drivingLicenceNumber: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A driver already exist with this licence number");
                    }
                } else {
                    throw new Error("A driver already exist with this licence number");
                }
            }
        }),
        
    check('drivingLicenceNumberExpiryDate')
            .notEmpty().withMessage("The 'Driving Licence Expiry Date' field is required")
            .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage("The 'Driving Licence Expiry Date' field is not valid"),
    
    check('drivingLicencePhoto')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.drivingLicencePhoto) {
                    throw new Error("The 'Driving Licence Photo' field is required");
                }
            }
            return true;
        })
        .optional()
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Driving Licence Photo is not an image"),

    check('adharNo')
        .notEmpty().withMessage("The 'Adhar Number' field is required")
        // .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/).withMessage("The 'Adhar Number' field is not valid")
        .custom(async (value, { req }) => {

            const body = req.body;
            const result = await DriverModel.findOne({ adharNo: value });

            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A driver already exist with this adhar number");
                    }
                } else {
                    throw new Error("A driver already exist with this adhar number");
                }
            }

        }),

    check('adharCardPhoto')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.adharCardPhoto) {
                    throw new Error("The 'Adhar Card Photo' field is required");
                }
            }
            return true;
        })
        .optional()
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Adhar Card Photo is not an image"),

    check('panNo')
        .notEmpty().withMessage("The 'Pan Number' field is required")
        // .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage("The 'Pan Number' field is not valid")
        .custom(async (value, { req }) => {

            const body = req.body;
            const result = await DriverModel.findOne({ panNo: value });

            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A driver already exist with this pan number");
                    }
                } else {
                    throw new Error("A driver already exist with this pan number");
                }
            }

        }),

    check('panCardPhoto')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.panCardPhoto) {
                    throw new Error("The 'Pan Card Photo' field is required");
                }
            }
            return true;
        })
        .optional()
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Pan Card Photo is not an image"),

    check('badgeNo')
        .notEmpty().withMessage("The 'Badge Number' field is required")
        // .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage("The 'Badge Number' field is not valid")
        .custom(async (value, { req }) => {

            const body = req.body;
            const result = await DriverModel.findOne({ badgeNo: value });

            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A driver already exist with this badge number");
                    }
                } else {
                    throw new Error("A driver already exist with this badge number");
                }
            }

        }),

    check('badgePhoto')
        .custom((v, { req }) => {
            if (!req.body._id) {
                if (!req.body.badgePhoto) {
                    throw new Error("The 'Badge Photo' field is required");
                }
            }
            return true;
        })
        .optional()
        .matches(/data:image\/[^;]+;base64[^"]+/).withMessage("Badge Photo is not an image"),

    check('address')
        .notEmpty().withMessage("The 'Address' field is required")
        .isString().withMessage("The 'Address' field is not valid"),

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
        // .isString().withMessage("The 'District' field is not valid")
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
        // .isString().withMessage("The 'Taluk' field is not valid")
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

    check('isApproved').
        notEmpty().withMessage("The 'Approval Status' field is required")
        .toBoolean(1 ? true : false),
    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];

export const walletValidationAdmin = [

    check('transactionType')
        .notEmpty().withMessage("The 'Transaction Type' field is required")
        .isIn(['debit', 'credit']).withMessage('This transaction type is not valid'),

    check('amount')
        .notEmpty().withMessage("The 'Amount' field is required")
        .isNumeric({ min:0}).withMessage("The 'Amount' field must be numeric"),
];

export const driverResetPasswordValidation = [
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
