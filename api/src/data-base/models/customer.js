import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

const CustomerSchema = new Schema({
    firstName: String,
    lastName: String,
    phoneNo: String,
    email: String,
    emailVerified: { 
        type: Boolean, 
        default: false 
    },
    password: String,
    dob: Date,
    photo: String,
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
    gender:String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    emailOtp:{
        type: Number,
        
    }
}, { timestamps: true });


// CustomerSchema.pre('save', function (next) { return next(); });


CustomerSchema.pre('save', async function (next) {
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

const CustomerModel = model('customer', CustomerSchema);

export default CustomerModel;