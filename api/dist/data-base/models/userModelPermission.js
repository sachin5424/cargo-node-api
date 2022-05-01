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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYXRhLWJhc2UvbW9kZWxzL3VzZXJNb2RlbFBlcm1pc3Npb24uanMiXSwibmFtZXMiOlsiU2NoZW1hIiwibW9uZ29vc2UiLCJ1c2VySWQiLCJ0eXBlIiwiVHlwZXMiLCJPYmplY3RJZCIsInJlZiIsInJlcXVpcmVkIiwicGVybWlzc2lvbklkIiwidGltZXN0YW1wcyIsIlVzZXJBdXRoTW9kZWxQZXJtaXNzaW9uIiwibW9kZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFlQTs7OztBQWZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLE1BQU1BLE1BQU0sR0FBRyxJQUFJQyxrQkFBU0QsTUFBYixDQUFvQjtBQUMvQkUsRUFBQUEsTUFBTSxFQUFFO0FBQ0pDLElBQUFBLElBQUksRUFBRUYsa0JBQVNELE1BQVQsQ0FBZ0JJLEtBQWhCLENBQXNCQyxRQUR4QjtBQUVKQyxJQUFBQSxHQUFHLEVBQUUsWUFGRDtBQUdKQyxJQUFBQSxRQUFRLEVBQUU7QUFITixHQUR1QjtBQU0vQkMsRUFBQUEsWUFBWSxFQUFFO0FBQ1ZMLElBQUFBLElBQUksRUFBRUYsa0JBQVNELE1BQVQsQ0FBZ0JJLEtBQWhCLENBQXNCQyxRQURsQjtBQUVWQyxJQUFBQSxHQUFHLEVBQUUsdUJBRks7QUFHVkMsSUFBQUEsUUFBUSxFQUFFO0FBSEE7QUFOaUIsQ0FBcEIsRUFXWjtBQUFFRSxFQUFBQSxVQUFVLEVBQUU7QUFBZCxDQVhZLENBQWY7O0FBWUEsTUFBTUMsdUJBQXVCLEdBQUdULGtCQUFTVSxLQUFULENBQWUsNkJBQWYsRUFBOENYLE1BQTlDLENBQWhDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdmFyIG1vbmdvb3NlID0gcmVxdWlyZSgnbW9uZ29vc2UnKTtcclxuLy8gLy9TZXQgdXAgZGVmYXVsdCBtb25nb29zZSBjb25uZWN0aW9uXHJcbi8vIGNvbnN0IHVzZXJNb2RlbFBlcm1pc3Npb24gPSBtb25nb29zZS5TY2hlbWEoe1xyXG4vLyAgICAgdXNlcklkOntcclxuLy8gICAgICAgICB0eXBlOm1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCxcclxuLy8gICAgICAgICByZWY6ICdhdXRoX3VzZXJzJyxcclxuLy8gICAgICAgICByZXF1aXJlZDp0cnVlXHJcbi8vICAgICB9LFxyXG4vLyAgICAgcGVybWlzc2lvbklkOntcclxuLy8gICAgICAgICB0eXBlOm1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCxcclxuLy8gICAgICAgICByZWY6ICdwZXJtaXNzaW9ucycsXHJcbi8vICAgICAgICAgcmVxdWlyZWQ6dHJ1ZVxyXG4vLyAgICAgfVxyXG4vLyB9KTtcclxuLy8gbW9kdWxlLmV4cG9ydHMgPSBtb25nb29zZS5tb2RlbCgndXNlcl9hdXRoX3Blcm1pc3Npb24nLHVzZXJNb2RlbFBlcm1pc3Npb24pXHJcbmltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcbmNvbnN0IFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgdXNlcklkOiB7XHJcbiAgICAgICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxyXG4gICAgICAgIHJlZjogJ2F1dGhfdXNlcnMnLFxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgcGVybWlzc2lvbklkOiB7XHJcbiAgICAgICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxyXG4gICAgICAgIHJlZjogJ3VzZXJfYXV0aF9wZXJtaXNzaW9ucycsXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgIH1cclxufSwgeyB0aW1lc3RhbXBzOiB0cnVlIH0pO1xyXG5jb25zdCBVc2VyQXV0aE1vZGVsUGVybWlzc2lvbiA9IG1vbmdvb3NlLm1vZGVsKCd1c2VyX2F1dGhfbW9kZWxfcGVybWlzc2lvbnMnLCBTY2hlbWEpO1xyXG5leHBvcnQgeyBVc2VyQXV0aE1vZGVsUGVybWlzc2lvbiB9O1xyXG4iXX0=