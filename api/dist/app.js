"use strict";

var _server = _interopRequireDefault(require("./server"));

var _config = _interopRequireDefault(require("./utls/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _server.default(_config.default.port);
app.listen();