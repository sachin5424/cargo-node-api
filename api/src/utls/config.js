const config = {
    DRIVER_PHOTO_UPLOAD_PATH: process.env.DRIVER_PHOTO_UPLOAD_PATH || "./uploads/drivers/",
    VEHICLE_PHOTO_UPLOAD_PATH: process.env.VEHICLE_PHOTO_UPLOAD_PATH || "./uploads/vehicle/photo/",
    VEHICLE_TYPE_ICON_UPLOAD_PATH: process.env.VEHICLE_TYPE_ICON_UPLOAD_PATH || "./uploads/vehicle/type/",
    VEHICLE_OWNER_PHOTO_UPLOAD_PATH: process.env.VEHICLE_OWNER_PHOTO_UPLOAD_PATH || "./uploads/vehicle/owner/",
}

export default config;