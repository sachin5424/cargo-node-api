import { check } from '../settings/import';
import { UserModel } from '../data-base';
import StateModel from '../data-base/models/state';
import DistrictModel from '../data-base/models/district';
import TalukModel from '../data-base/models/taluk';
import { getAdminFilter } from '../utls/_helper';

export const userLoginValidation = [
    check('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Provide a valid email")
        .custom(async (v) => {
            try {
                const r = await UserModel.findOne({ email: v, isDeleted: false });
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

export const userValidation = [

    check('_id')
        .optional()
        .notEmpty().withMessage("Provide / Select a valid data")
        .custom(async (v) => {
            try {
                const r = await UserModel.findOne({_id: v, isDeleted: false, ...getAdminFilter()});
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
            const result = await UserModel.findOne({ isDeleted: false, phoneNo: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A user already exist with this phone number");
                    }
                } else {
                    throw new Error("A user already exist with this phone number");
                }
            }
        }),

    check('email')
        .notEmpty().withMessage("The 'Email' field is required")
        .isEmail().withMessage("The 'Email' field is not valid")
        .custom(async (value, { req }) => {
            const body = req.body;
            const result = await UserModel.findOne({ isDeleted: false, email: value });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A user already exist with this email");
                    }
                } else {
                    throw new Error("A user already exist with this email");
                }
            }
        }),

    check('userName')
        .notEmpty().withMessage("The 'User Name' field is required")
        .isSlug().withMessage("User Name field must not contain any special charecter except '-'")
        .custom(async (value, { req }) => {
            req.body.userName = req.body.userName.toLowerCase().replace(/[^a-z0-9 _-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
            const body = req.body;
            const result = await UserModel.findOne({ userName: body.userName });
            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A user already exist with this user name");
                    }
                } else {
                    throw new Error("A user already exist with this user name");
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

    check('type')
        .notEmpty().withMessage("The 'User Type' field is required")
        .isIn(['stateAdmin', 'districtAdmin', 'talukAdmin']).withMessage("The 'User Type' field is not valid"),

    check('address')
        .notEmpty().withMessage("The 'Address' field is required")
        .isString().withMessage("The 'Address' field is not valid"),

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

    check('zipcode')
        .notEmpty().withMessage("The 'Zipcode' field is required")
        .matches(/^[1-9]{1}[0-9]{5}$/).withMessage("The 'Zipcode' field is not valid"),

    check('adharNo')
        .notEmpty().withMessage("The 'Adhar Number' field is required")
        // .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/).withMessage("The 'Adhar Number' field is not valid")
        .custom(async (value, { req }) => {

            const body = req.body;
            const result = await UserModel.findOne({ adharNo: value });

            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A user already exist with this adhar number");
                    }
                } else {
                    throw new Error("A user already exist with this adhar number");
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
            const result = await UserModel.findOne({ panNo: value });

            if (result) {
                if (body._id) {
                    if (result._id != body._id) {
                        throw new Error("A user already exist with this pan number");
                    }
                } else {
                    throw new Error("A user already exist with this pan number");
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

    check('isActive').
        notEmpty().withMessage("The 'active' field is required")
        .toBoolean(1 ? true : false),
];
