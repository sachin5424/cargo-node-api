import { Schema, model } from 'mongoose';

const UserTypePermissionSchema = new Schema({
    typeName: String,
    typeKey: String,
    grantedModules: [
        {
            type: String
        }
    ]
}, { timestamps: false });

const UserTypePermissionModel = model('userTypePermission', UserTypePermissionSchema);

export default UserTypePermissionModel;