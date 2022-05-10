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
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    driverId: {
        type: Number,
        unique: true,
    },
    // name: String,
    firstName: String,
    lastName: String,
    phoneNo: String,
    email: String,
    userName: {
        type: String,
        unique: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'male'
    },
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
    ratingCount: {
        type: Number,
        default: 0
    },
    ratingAverage: {
        type: Number,
        default: 0
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
        if(!this.driverId || this.driverId < 1232141){
            const ld = await DriverModel.findOne().sort({ driverId: -1 });
            if(ld && ld.driverId >= 1232141){
                this.driverId = ld.driverId + 1;
            } else{
                this.driverId = 1232141;
            }
        }
    } catch(err){
        next(err);
    }
    next();
});

const DriverModel = model('driver', DriverSchema);

export default DriverModel;