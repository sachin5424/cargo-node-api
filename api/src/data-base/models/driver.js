import { Schema, model } from 'mongoose';

const DriverSchema = new Schema({
    firstName: String,
    lastName: String,
    phoneNo: String,
    dob: Date,
    photo: String,
    drivingLicenceNumber: String,
    drivingLicenceNumberExpiryDate: Date,
    adharNo: String,
    panNo: String,
    address: String,
    state: String,
    district: String,
    tehsil: String,
    pincode: String,

    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });


// DriverSchema.pre('save', function (next) { return next(); });

const DriverModel = model('driver', DriverSchema);

export default DriverModel;