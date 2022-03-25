import mongoose, {Schema} from 'mongoose';

const DriverWalletSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: "driver",
    },
    transactionId: {
        type: String,
        unique: true
    },
    transactionType: {
        type: String,
        enum: ['debit', 'credit'],
    },
    transactionMethod: {
        type: String,
        enum: ['byAdmin', 'online']
    },
    amount: Number,
    previousAmount: Number,
    currentAmount: Number,
    status: {
        type: String,
        enum: ['pending', 'failed', 'completed'],
    },
    description: String
}, { timestamps: true });

const DriverWalletModel = mongoose.model('driverWallet', DriverWalletSchema);
export default DriverWalletModel;