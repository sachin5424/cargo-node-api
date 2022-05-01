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
    }
}

export default config;