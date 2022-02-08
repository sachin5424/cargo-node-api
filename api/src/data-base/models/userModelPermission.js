// var mongoose = require('mongoose');
// //Set up default mongoose connection
// const userModelPermission = mongoose.Schema({
//     userId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref: 'auth_users',
//         required:true
//     },
//     permissionId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref: 'permissions',
//         required:true
//     }
// });
// module.exports = mongoose.model('user_auth_permission',userModelPermission)
import mongoose from 'mongoose';
const Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth_users',
        required: true
    },
    permissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_auth_permissions',
        required: true
    }
}, { timestamps: true });
const UserAuthModelPermission = mongoose.model('user_auth_model_permissions', Schema);
export { UserAuthModelPermission };
