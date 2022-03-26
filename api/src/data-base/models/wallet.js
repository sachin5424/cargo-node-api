import mongoose, {Schema} from 'mongoose';

const WalletSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: "driver",
        unique: true
    },
    amount: Number,
}, { timestamps: true });

const WalletModel = mongoose.model('wallet', WalletSchema);
export default WalletModel;