const config = {
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
        }
    }
}

export default config;