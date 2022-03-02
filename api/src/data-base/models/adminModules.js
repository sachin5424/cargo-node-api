import { Schema, model } from 'mongoose';

const adminModulesSchema = new Schema({
    typeName: String,
    typeKey: String,
    grantedModules: [
        {
            type: Schema.Types.ObjectId,
        }
    ]
}, { timestamps: false });

const AdminModulesModel = model('adminModules', adminModulesSchema);

export default AdminModulesModel;