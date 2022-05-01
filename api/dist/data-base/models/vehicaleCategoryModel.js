"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const vehicleCategoryScheam = new _mongoose.default.Schema({
  serviceType: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "serviceType"
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  photo: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const VehicleCategoryModel = _mongoose.default.model('vehicleCategory', vehicleCategoryScheam);

var _default = VehicleCategoryModel;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYXRhLWJhc2UvbW9kZWxzL3ZlaGljYWxlQ2F0ZWdvcnlNb2RlbC5qcyJdLCJuYW1lcyI6WyJ2ZWhpY2xlQ2F0ZWdvcnlTY2hlYW0iLCJtb25nb29zZSIsIlNjaGVtYSIsInNlcnZpY2VUeXBlIiwidHlwZSIsIlR5cGVzIiwiT2JqZWN0SWQiLCJyZWYiLCJuYW1lIiwiU3RyaW5nIiwicmVxdWlyZWQiLCJzbHVnIiwicGhvdG8iLCJkZWZhdWx0IiwiaXNBY3RpdmUiLCJCb29sZWFuIiwiaXNEZWxldGVkIiwidGltZXN0YW1wcyIsIlZlaGljbGVDYXRlZ29yeU1vZGVsIiwibW9kZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBQ0EsTUFBTUEscUJBQXFCLEdBQUcsSUFBSUMsa0JBQVNDLE1BQWIsQ0FBb0I7QUFDOUNDLEVBQUFBLFdBQVcsRUFBRTtBQUNUQyxJQUFBQSxJQUFJLEVBQUVGLGlCQUFPRyxLQUFQLENBQWFDLFFBRFY7QUFFVEMsSUFBQUEsR0FBRyxFQUFFO0FBRkksR0FEaUM7QUFLOUNDLEVBQUFBLElBQUksRUFBRTtBQUNGSixJQUFBQSxJQUFJLEVBQUVLLE1BREo7QUFFRkMsSUFBQUEsUUFBUSxFQUFFO0FBRlIsR0FMd0M7QUFTOUNDLEVBQUFBLElBQUksRUFBRTtBQUNGUCxJQUFBQSxJQUFJLEVBQUVLO0FBREosR0FUd0M7QUFZOUNHLEVBQUFBLEtBQUssRUFBRTtBQUNIUixJQUFBQSxJQUFJLEVBQUVLLE1BREg7QUFFSEksSUFBQUEsT0FBTyxFQUFFO0FBRk4sR0FadUM7QUFnQjlDQyxFQUFBQSxRQUFRLEVBQUU7QUFDTlYsSUFBQUEsSUFBSSxFQUFFVyxPQURBO0FBRU5GLElBQUFBLE9BQU8sRUFBRTtBQUZILEdBaEJvQztBQW9COUNHLEVBQUFBLFNBQVMsRUFBRTtBQUNQWixJQUFBQSxJQUFJLEVBQUVXLE9BREM7QUFFUEYsSUFBQUEsT0FBTyxFQUFFO0FBRkY7QUFwQm1DLENBQXBCLEVBd0IzQjtBQUFFSSxFQUFBQSxVQUFVLEVBQUU7QUFBZCxDQXhCMkIsQ0FBOUI7O0FBMEJBLE1BQU1DLG9CQUFvQixHQUFHakIsa0JBQVNrQixLQUFULENBQWUsaUJBQWYsRUFBa0NuQixxQkFBbEMsQ0FBN0I7O2VBQ2VrQixvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSwge1NjaGVtYX0gZnJvbSAnbW9uZ29vc2UnO1xyXG5jb25zdCB2ZWhpY2xlQ2F0ZWdvcnlTY2hlYW0gPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgIHNlcnZpY2VUeXBlOiB7XHJcbiAgICAgICAgdHlwZTogU2NoZW1hLlR5cGVzLk9iamVjdElkLFxyXG4gICAgICAgIHJlZjogXCJzZXJ2aWNlVHlwZVwiLFxyXG4gICAgfSxcclxuICAgIG5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICB9LFxyXG4gICAgc2x1Zzoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgIH0sXHJcbiAgICBwaG90bzoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgaXNBY3RpdmU6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBpc0RlbGV0ZWQ6IHtcclxuICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICB9LFxyXG59LCB7IHRpbWVzdGFtcHM6IHRydWUgfSk7XHJcblxyXG5jb25zdCBWZWhpY2xlQ2F0ZWdvcnlNb2RlbCA9IG1vbmdvb3NlLm1vZGVsKCd2ZWhpY2xlQ2F0ZWdvcnknLCB2ZWhpY2xlQ2F0ZWdvcnlTY2hlYW0pO1xyXG5leHBvcnQgZGVmYXVsdCBWZWhpY2xlQ2F0ZWdvcnlNb2RlbDsiXX0=