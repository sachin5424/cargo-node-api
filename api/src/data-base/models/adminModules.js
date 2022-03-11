import { Schema, model } from 'mongoose';

const adminModulesSchema = new Schema({
    typeName: String,
    typeKey: String,
    grantedModules: [
        {
            type: String,
        }
    ]
}, { timestamps: false });

const AdminModulesModel = model('adminModules', adminModulesSchema);

export default AdminModulesModel;