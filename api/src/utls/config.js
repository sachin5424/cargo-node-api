const config = {
    IsLocal: process.env.NODE_ENV === 'local',
    IsProd: process.env.NODE_ENV === 'prod',
  
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

    logDir: process.env.LOG_DIR || 'logs',
}

export default config;