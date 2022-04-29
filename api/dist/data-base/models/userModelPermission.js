"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserAuthModelPermission = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
const Schema = new _mongoose.default.Schema({
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'auth_users',
    required: true
  },
  permissionId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'user_auth_permissions',
    required: true
  }
}, {
  timestamps: true
});

const UserAuthModelPermission = _mongoose.default.model('user_auth_model_permissions', Schema);

exports.UserAuthModelPermission = UserAuthModelPermission;