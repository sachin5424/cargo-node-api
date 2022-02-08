import mongoose from 'mongoose';
const Schema = new mongoose.Schema({
    title: {
        type: String
    },
    model_name: { type: String },
    method: {
        type: String
    },
}, { timestamps: true });
const UserAuthPermission = mongoose.model('user_auth_permissions', Schema);
export { UserAuthPermission };
