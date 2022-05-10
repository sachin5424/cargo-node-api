import { Schema, model } from 'mongoose';

const CustomerCardSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "state",
    },
    name: String,
    cardNumber: {
        type: String,
        unique: true,
    },
    expiryDate: String,
    cvv: String,
    
}, { timestamps: true });

const CustomerCardModel = model('customerCard', CustomerCardSchema);

export default CustomerCardModel;