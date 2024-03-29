import { check } from '../settings/import';
import CustomerModel from '../data-base/models/customer';
import CustomerLocationModel from '../data-base/models/customerLocation';
import StateModel from '../data-base/models/state';
import DistrictModel from '../data-base/models/district';
import TalukModel from '../data-base/models/taluk';
import { clearSearch } from '../utls/_helper';
import config from '../utls/config';


export const customerLoginValidation = [
    check('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Provide a valid email")
        .custom(async (v) => {
            try {
                const r = await CustomerModel.findOne({ email: v, isDeleted: false });
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
        .custom(async (v, { req }) => {
            try {
                const search = { _id: v, isDeleted: false, state: global.state, district: global.district, taluk: global.taluk };
                clearSearch(search);
                const r = await CustomerModel.findOne(search);
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
            const result = await CustomerModel.findOne({ isDeleted: false, phoneNo: value });
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
            const result = await CustomerModel.findOne({ isDeleted: false, email: value });
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

    check('userName')
        .notEmpty().withMessage("The 'User Name' field is required")
        .isSlug().withMessage("User Name field must not contain any special charecter except '-'")
        .custom(async (value, { req }) => {
            req.body.userName = req.body.userName.toLowerCase().replace(/[^a-z0-9 _-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
            const body = req.body;
            const result = await CustomerModel.findOne({ userName: body.userName });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A customer already exist with this user name");
                    }
                } else {
                    throw new Error("A customer already exist with this user name");
                }
            }
        }),

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

            if (password !== confirmPassword) {
                throw new Error("Both password does not match");
            }
        }),
];

export const cardValidation = [

    check('name')
        .notEmpty().withMessage("Name field is required")
        .isString().withMessage("Name field is not valid")
        .custom(async (v, { req }) => {
            try {
                const r = await CustomerModel.findById(req.__cuser._id);
                if (!r) {
                    throw new Error("Customer not found");
                }
            } catch (e) {
                throw new Error("Error!");
            }
        }),

    check('cardNumber')
        .notEmpty().withMessage("Card Number is required")
        .custom(async (value) => {
            try {
                let err = true;
                config.cards.forEach(v => {
                    if (value.match(v.regEx)) {
                        err = false;
                    }

                });
                if (err) {
                    throw new Error("Card Number is not valid");
                }
            } catch (e) {
                throw new Error("Card Number is not valid");
            }
        }),

    check('expiryDate')
        .notEmpty().withMessage("Expiry Date is required")
        .matches(/\d{4}-(0[1-9]|1[0-2])$/).withMessage("Expiry Date field is not valid"),

    check('cvv')
        .matches(/\d{3}$/).withMessage("CVV is not valid")

];
