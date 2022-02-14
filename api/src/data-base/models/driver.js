import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

const DriverSchema = new Schema({
    firstName: String,
    lastName: String,
    // driverId: String,
    phoneNo: String,
    email: String,
    emailVerified: { 
        type: Boolean, 
        default: false 
    },
    password: String,
    dob: Date,
    photo: String,
    drivingLicenceNumber: String,
    drivingLicenceImage: String,
    drivingLicenceNumberExpiryDate: Date,
    adharNo: String,
    adharImage: String,
    panNo: String,
    panImage: String,
    badgeNo: String,
    badgeImage: String,
    address: String,
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
    zipcode: String,

    isDocApproved: {
        type: Boolean,
        default: false
    },

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