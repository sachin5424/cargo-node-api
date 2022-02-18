import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

const CustomerLocationSchema = new Schema({
    
    customer: {
        type: Schema.Types.ObjectId,
        ref: "customer",
    },
    
    name: String,
    latlong: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    
}, { timestamps: true });


const CustomerLocationModel = model('customerLocation', CustomerLocationSchema);

export default CustomerLocationModel;