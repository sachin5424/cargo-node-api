import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

const DriverSchema = new Schema({
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: "vehicle",
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: "state",
    },
    district: {
        type: Schema.Types.ObjectId,
        ref: "district",
    },
    taluk: {
        type: Schema.Types.ObjectId,
        ref: "taluk",
    },
    driverId: {
        type: Number,
        unique: true,
    },
    firstName: String,
    lastName: String,
    phoneNo: String,
    email: String,
    otpVerified: { 
        type: Boolean, 
        default: false 
    },
    password: String,
    dob: Date,
    address: String,
    zipcode: String,
    photo: String,
    
    drivingLicenceNumber: String,
    drivingLicenceNumberExpiryDate: Date,
    drivingLicencePhoto: String,

    adharNo: String,
    adharCardPhoto: String,

    panNo: String,
    panCardPhoto: String,

    badgeNo: String,
    badgePhoto: String,

    isOnline: {
        type: Boolean,
        default: false
    },

    isApproved: {
        type: Boolean,
        default: false
    },

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


DriverSchema.pre('save', async function (next) {
    try{
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    } catch(err){
        next(err);
    }
    next();
});

const DriverModel = model('driver', DriverSchema);

export default DriverModel;