import mongoose from 'mongoose';
const UserTokenSchema = new mongoose.Schema({
    email: {
        type: String
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });
const UserTokenModel = mongoose.model('user_token', UserTokenSchema);
export { UserTokenModel };
