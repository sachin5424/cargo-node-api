import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

const vehicleOwnerSchema = new Schema({

    serviceType: {
        type: Schema.Types.ObjectId,
        ref: "serviceType",
    },
    firstName: String,
    lastName: String,
    phoneNo: String,
    email: String,
    emailVerfied: { 
        type: Boolean, 
        default: false 
    },
    photo: String,
    password: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });


// vehicleOwner.pre('save', function (next) { return next(); });

vehicleOwnerSchema.pre('save', async function (next) {
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

const VehicleOwnerModel = model('vehicleOwner', vehicleOwnerSchema);

export default VehicleOwnerModel;