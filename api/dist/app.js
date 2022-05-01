"use strict";

var _server = _interopRequireDefault(require("./server"));

var _config = _interopRequireDefault(require("./utls/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _server.default(_config.default.port);
app.listen();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiQXBwIiwiY29uZmlnIiwicG9ydCIsImxpc3RlbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFDQTs7OztBQUdBLE1BQU1BLEdBQUcsR0FBRyxJQUFJQyxlQUFKLENBQVFDLGdCQUFPQyxJQUFmLENBQVo7QUFDQUgsR0FBRyxDQUFDSSxNQUFKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFwcCBmcm9tIFwiLi9zZXJ2ZXJcIjtcclxuaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi91dGxzL2NvbmZpZ1wiO1xyXG5cclxuXHJcbmNvbnN0IGFwcCA9IG5ldyBBcHAoY29uZmlnLnBvcnQpO1xyXG5hcHAubGlzdGVuKCk7XHJcblxyXG5cclxuXHJcblxyXG4iXX0=