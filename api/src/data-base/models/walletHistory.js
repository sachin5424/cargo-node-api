import mongoose, {Schema} from 'mongoose';

const WalletHistorySchema = new Schema({
    wallet: {
        type: Schema.Types.ObjectId,
        ref: "wallet",
    },
    transactionId: {
        type: Number,
        unique: true
    },
    transactionType: {
        type: String,
        enum: ['debit', 'credit'],
    },
    transactionMethod: {
        type: String,
        enum: ['byAdmin', 'paytm']
    },
    amount: Number,
    status: {
        type: String,
        enum: ['pending', 'failed', 'completed'],
    },
    description: String
}, { timestamps: true });

const WalletHistoryModel = mongoose.model('walletHistory', WalletHistorySchema);
export default WalletHistoryModel;