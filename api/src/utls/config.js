const config = {
    IsLocal: process.env.NODE_ENV != 'prod',
    IsProd: process.env.NODE_ENV == 'prod',

    port: parseInt(process.env.PORT, 10) || 3003,

    database: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        retryWrites: process.env.DB_RETRYWRITES || true,
    },

    jwt: {
        expDuration: process.env.JWT_TIME,
        secretKey: process.env.JWT_SECREATE_kEY
    },

    uploadPaths: {
        driver: {
            photo: process.env.DRIVER_PHOTO_UPLOAD_PATH || "/uploads/driver/photo/",
            document: process.env.DRIVER_DOCUMENT_UPLOAD_PATH || "/uploads/driver/document/",
        },
        vehicle: {
            category: process.env.VEHICLE_CATEGORY_PHOTO_UPLOAD_PATH || "./uploads/vehicle/category/",
            photo: process.env.VEHICLE_PHOTO_UPLOAD_PATH || "./uploads/vehicle/photo/",
            document: process.env.VEHICLE_DOCUMENT_UPLOAD_PATH || "./uploads/vehicle/document/",
        },
        ride: {
            type: process.env.RIDE_TYPE_PHOTO_UPLOAD_PATH || "./uploads/ride/type/",
        },
        user: {
            photo: process.env.USER_PHOTO_UPLOAD_PATH || "./uploads/user/photo/",
            document: process.env.USER_DOCUMENT_UPLOAD_PATH || "./uploads/user/document/",
        },
        customer: {
            photo: process.env.CUSTOMER_PHOTO_UPLOAD_PATH || "/uploads/customer/photo/",
        }
    },

    logs: {
        level: process.env.LOG_LEVEL || 'info',
    },

    email: {
        id: process.env.MAILID,
        password: process.env.MAILPASSWORD
    },

    crypto: {
        algorithm: 'aes-256-ctr',
        encryptionKey: Buffer.from('FoCKvdLslUuB2x3EZlKate7XGottHski1LmyqJHvUht=', 'base64'),
        ivLength: 16
    },

    logDir: process.env.LOG_DIR || 'logs',

    forgetPassExpTime: process.env.FORGET_PASS_EXP_TIME || 30,

    applicationBaseUrl: process.env.APPLICATION_BASE_URL,

    applicationApiBaseUrl:
        process.env.NODE_ENV == 'prod'
            ? process.env.APPLICATION_BASE_URL
            : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}`,

    applicationFileUrl:
        process.env.NODE_ENV == 'prod'
            ? process.env.APPLICATION_API_BASE_URL + '/files/'
            : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/files/`,

    baseurls: {
        emailVerification: {
            vehicleOwner:
                process.env.NODE_ENV == 'prod'
                    ? process.env.APPLICATION_API_BASE_URL + `:${parseInt(process.env.PORT, 10) || 3003}/vehicle-owner/user/email-verify`
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/vehicle-owner/user/email-verify`,

            customer:
                process.env.NODE_ENV == 'prod'
                    ? process.env.APPLICATION_API_BASE_URL + `:${parseInt(process.env.PORT, 10) || 3003}/customer/user/email-verify`
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/customer/user/email-verify`,

            driver:
                process.env.NODE_ENV == 'prod'
                    ? process.env.APPLICATION_API_BASE_URL + `:${parseInt(process.env.PORT, 10) || 3003}/driver/user/email-verify`
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/driver/user/email-verify`
        },

        resetPassword: {
            vehicleOwner:
                process.env.NODE_ENV == 'prod'
                    ? process.env.APPLICATION_API_BASE_URL + `:${parseInt(process.env.PORT, 10) || 3003}/vehicle-owner/user/reset-password`
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/vehicle-owner/user/reset-password`,

            customer:
                process.env.NODE_ENV == 'prod'
                    ? process.env.APPLICATION_API_BASE_URL + `:${parseInt(process.env.PORT, 10) || 3003}/customer/user/reset-password`
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/customer/user/reset-password`,

            driver:
                process.env.NODE_ENV == 'prod'
                    ? process.env.APPLICATION_API_BASE_URL + `:${parseInt(process.env.PORT, 10) || 3003}/driver/user/reset-password`
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/driver/user/reset-password`
        },
    },

    sendGrid: {
        apiKey: process.env.SENDGRID_API_KEY,
        senderEmail: process.env.SENDGRID_SENDER_EMAIL,
    },

    cards: [
        {
            name: 'Amex Card', regEx: /^3[47][0-9]{13}$/
        },
        {
            name: 'BCGlobal', regEx: /^(6541|6556)[0-9]{12}$/
        },
        {
            name: 'Carte Blanche Card', regEx: /^389[0-9]{11}$/
        },
        {
            name: 'Diners Club Card', regEx: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/
        },
        {
            name: 'Discover Card', regEx: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/
        },
        {
            name: 'Insta Payment Card', regEx: /^63[7-9][0-9]{13}$/
        },
        {
            name: 'JCB Card', regEx: //
        },
        {
            name: '', regEx: /^(?:2131|1800|35\d{3})\d{11}$/
        },
        {
            name: 'KoreanLocalCard', regEx: /^9[0-9]{15}$/
        },
        {
            name: 'Laser Card', regEx: /^(6304|6706|6709|6771)[0-9]{12,15}$/
        },
        {
            name: 'Maestro Card', regEx: /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/
        },
        {
            name: 'Mastercard', regEx: /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/
        },
        {
            name: 'Solo Card', regEx: /^(6334|6767)[0-9]{12}|(6334|6767)[0-9]{14}|(6334|6767)[0-9]{15}$/
        },
        {
            name: 'Switch Card', regEx: /^(4903|4905|4911|4936|6333|6759)[0-9]{12}|(4903|4905|4911|4936|6333|6759)[0-9]{14}|(4903|4905|4911|4936|6333|6759)[0-9]{15}|564182[0-9]{10}|564182[0-9]{12}|564182[0-9]{13}|633110[0-9]{10}|633110[0-9]{12}|633110[0-9]{13}$/
        },
        {
            name: 'Union Pay Card', regEx: /^(62[0-9]{14,17})$/
        },
        {
            name: 'Visa Card', regEx: /^4[0-9]{12}(?:[0-9]{3})?$/
        },
        {
            name: 'Visa Master Card', regEx: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/

        },
    ]
}

export default config;