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
            adhar: process.env.DRIVER_ADHAR_UPLOAD_PATH || "/uploads/driver/adhar/",
            badge: process.env.DRIVER_BADGE_UPLOAD_PATH || "/uploads/driver/badge/",
            pan: process.env.DRIVER_PAN_UPLOAD_PATH || "/uploads/driver/pan/",
            licence: process.env.DRIVER_LICENCE_UPLOAD_PATH || "/uploads/driver/licence/",

        },
        vehicle: {
            photo: process.env.VEHICLE_PHOTO_UPLOAD_PATH || "./uploads/vehicle/photo/",
            type: process.env.VEHICLE_TYPE_ICON_UPLOAD_PATH || "./uploads/vehicle/type/",
            owner: process.env.VEHICLE_OWNER_PHOTO_UPLOAD_PATH || "./uploads/vehicle/owner/",
        },
        user: {
            photo: process.env.USER_PHOTO_UPLOAD_PATH || "./uploads/user/photo/",
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
                    ? process.env.APPLICATION_API_BASE_URL + '/vehicle-owner/user/email-verify'
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/vehicle-owner/user/email-verify`,

            customer: 
                process.env.NODE_ENV == 'prod'
                    ? process.env.APPLICATION_API_BASE_URL + '/customer/user/email-verify'
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/customer/user/email-verify`,

            driver: 
                process.env.NODE_ENV == 'prod'
                    ? process.env.APPLICATION_API_BASE_URL + '/driver/user/email-verify'
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/driver/user/email-verify`
        }, 

        resetPassword: {
            vehicleOwner: 
                process.env.NODE_ENV == 'prod'
                    ? process.env.APPLICATION_API_BASE_URL + '/vehicle-owner/user/reset-password'
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/vehicle-owner/user/reset-password`,

            customer: 
                process.env.NODE_ENV == 'prod'
                    ? process.env.APPLICATION_API_BASE_URL + '/customer/user/reset-password'
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/customer/user/reset-password`,

            driver: 
                process.env.NODE_ENV == 'prod'
                    ? process.env.APPLICATION_API_BASE_URL + '/driver/user/reset-password'
                    : `http://localhost:${parseInt(process.env.PORT, 10) || 3003}/driver/user/reset-password`
        }, 
    }
}

export default config;