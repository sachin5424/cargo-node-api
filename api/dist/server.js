"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

require("dotenv/config");

var _index = require("./data-base/index");

var _modules = _interopRequireDefault(require("./modules"));

var _Logger = _interopRequireDefault(require("./utls/Logger"));

var _config2 = _interopRequireDefault(require("./utls/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import createModules from './data-base/models-permission/createModules';
class App {
  constructor(port) {
    this.app = (0, _express.default)();
    this.initializeMiddlewares();
    this.port = port;
    (0, _index.databaseConnect)(); // createModules();

    this.app.use('/files', _express.default.static('uploads'));
    this.app.use((0, _cors.default)());
    (0, _modules.default)(this.app);

    _Logger.default.init({
      level: _config2.default.logs.level
    });

    process.on('uncaughtException', function (error) {
      _Logger.default.error("Uncaught Exception : ");

      _Logger.default.error(error);
    });
  }

  initializeMiddlewares() {
    this.app.use(_express.default.json({
      limit: '50mb'
    }));
    this.app.use(_express.default.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000
    }));
    this.app.use(_express.default.json());
  }

  listen() {
    this.app.listen(this.port, () => {
      _Logger.default.log('info', `
              ################################################
              🛡️  Server listening on port: ${this.port} 🛡️
              ################################################
            `);
    });
  }

}

exports.default = App;