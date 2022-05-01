"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = new _mongoose.default.Schema({
  title: String,
  key: String
}, {
  timestamps: false
});

const ModuleModel = _mongoose.default.model('module', Schema);

var _default = ModuleModel;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYXRhLWJhc2UvbW9kZWxzL21vZHVlLmpzIl0sIm5hbWVzIjpbIlNjaGVtYSIsIm1vbmdvb3NlIiwidGl0bGUiLCJTdHJpbmciLCJrZXkiLCJ0aW1lc3RhbXBzIiwiTW9kdWxlTW9kZWwiLCJtb2RlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0EsTUFBTUEsTUFBTSxHQUFHLElBQUlDLGtCQUFTRCxNQUFiLENBQW9CO0FBQy9CRSxFQUFBQSxLQUFLLEVBQUVDLE1BRHdCO0FBRS9CQyxFQUFBQSxHQUFHLEVBQUVEO0FBRjBCLENBQXBCLEVBR1o7QUFBRUUsRUFBQUEsVUFBVSxFQUFFO0FBQWQsQ0FIWSxDQUFmOztBQUtBLE1BQU1DLFdBQVcsR0FBR0wsa0JBQVNNLEtBQVQsQ0FBZSxRQUFmLEVBQXlCUCxNQUF6QixDQUFwQjs7ZUFDZU0sVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcbmNvbnN0IFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xyXG4gICAgdGl0bGU6IFN0cmluZyxcclxuICAgIGtleTogU3RyaW5nLFxyXG59LCB7IHRpbWVzdGFtcHM6IGZhbHNlIH0pO1xyXG5cclxuY29uc3QgTW9kdWxlTW9kZWwgPSBtb25nb29zZS5tb2RlbCgnbW9kdWxlJywgU2NoZW1hKTtcclxuZXhwb3J0IGRlZmF1bHQgTW9kdWxlTW9kZWw7Il19