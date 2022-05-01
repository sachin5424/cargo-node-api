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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOlsiQXBwIiwiY29uc3RydWN0b3IiLCJwb3J0IiwiYXBwIiwiaW5pdGlhbGl6ZU1pZGRsZXdhcmVzIiwidXNlIiwiZXhwcmVzcyIsInN0YXRpYyIsIkxvZ2dlciIsImluaXQiLCJsZXZlbCIsIkNvbmZpZyIsImxvZ3MiLCJwcm9jZXNzIiwib24iLCJlcnJvciIsImpzb24iLCJsaW1pdCIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsInBhcmFtZXRlckxpbWl0IiwibGlzdGVuIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7QUFIQTtBQUtlLE1BQU1BLEdBQU4sQ0FBVTtBQUNyQkMsRUFBQUEsV0FBVyxDQUFDQyxJQUFELEVBQU87QUFDZCxTQUFLQyxHQUFMLEdBQVcsdUJBQVg7QUFDQSxTQUFLQyxxQkFBTDtBQUNBLFNBQUtGLElBQUwsR0FBWUEsSUFBWjtBQUNBLGtDQUpjLENBS2Q7O0FBQ0EsU0FBS0MsR0FBTCxDQUFTRSxHQUFULENBQWEsUUFBYixFQUF1QkMsaUJBQVFDLE1BQVIsQ0FBZSxTQUFmLENBQXZCO0FBQ0EsU0FBS0osR0FBTCxDQUFTRSxHQUFULENBQWEsb0JBQWI7QUFDQSwwQkFBTyxLQUFLRixHQUFaOztBQUVBSyxvQkFBT0MsSUFBUCxDQUFZO0FBQUVDLE1BQUFBLEtBQUssRUFBRUMsaUJBQU9DLElBQVAsQ0FBWUY7QUFBckIsS0FBWjs7QUFDQUcsSUFBQUEsT0FBTyxDQUFDQyxFQUFSLENBQVcsbUJBQVgsRUFBZ0MsVUFBVUMsS0FBVixFQUFpQjtBQUM3Q1Asc0JBQU9PLEtBQVAsQ0FBYSx1QkFBYjs7QUFDQVAsc0JBQU9PLEtBQVAsQ0FBYUEsS0FBYjtBQUNILEtBSEQ7QUFJSDs7QUFDRFgsRUFBQUEscUJBQXFCLEdBQUc7QUFDcEIsU0FBS0QsR0FBTCxDQUFTRSxHQUFULENBQWFDLGlCQUFRVSxJQUFSLENBQWE7QUFBRUMsTUFBQUEsS0FBSyxFQUFFO0FBQVQsS0FBYixDQUFiO0FBQ0EsU0FBS2QsR0FBTCxDQUFTRSxHQUFULENBQWFDLGlCQUFRWSxVQUFSLENBQW1CO0FBQUVELE1BQUFBLEtBQUssRUFBRSxNQUFUO0FBQWlCRSxNQUFBQSxRQUFRLEVBQUUsSUFBM0I7QUFBaUNDLE1BQUFBLGNBQWMsRUFBRTtBQUFqRCxLQUFuQixDQUFiO0FBQ0EsU0FBS2pCLEdBQUwsQ0FBU0UsR0FBVCxDQUFhQyxpQkFBUVUsSUFBUixFQUFiO0FBQ0g7O0FBQ0RLLEVBQUFBLE1BQU0sR0FBRztBQUNMLFNBQUtsQixHQUFMLENBQVNrQixNQUFULENBQWdCLEtBQUtuQixJQUFyQixFQUEyQixNQUFNO0FBQzdCTSxzQkFBT2MsR0FBUCxDQUNJLE1BREosRUFFSztBQUNqQjtBQUNBLCtDQUErQyxLQUFLcEIsSUFBSztBQUN6RDtBQUNBLGFBTlk7QUFRSCxLQVREO0FBVUg7O0FBakNvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcclxuaW1wb3J0ICdkb3RlbnYvY29uZmlnJztcclxuaW1wb3J0IHsgZGF0YWJhc2VDb25uZWN0IH0gZnJvbSAnLi9kYXRhLWJhc2UvaW5kZXgnO1xyXG4vLyBpbXBvcnQgY3JlYXRlTW9kdWxlcyBmcm9tICcuL2RhdGEtYmFzZS9tb2RlbHMtcGVybWlzc2lvbi9jcmVhdGVNb2R1bGVzJztcclxuaW1wb3J0IHJvdXRlciBmcm9tICcuL21vZHVsZXMnO1xyXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vdXRscy9Mb2dnZXInO1xyXG5pbXBvcnQgQ29uZmlnIGZyb20gJy4vdXRscy9jb25maWcnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwIHtcclxuICAgIGNvbnN0cnVjdG9yKHBvcnQpIHtcclxuICAgICAgICB0aGlzLmFwcCA9IGV4cHJlc3MoKTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVNaWRkbGV3YXJlcygpO1xyXG4gICAgICAgIHRoaXMucG9ydCA9IHBvcnQ7XHJcbiAgICAgICAgZGF0YWJhc2VDb25uZWN0KCk7XHJcbiAgICAgICAgLy8gY3JlYXRlTW9kdWxlcygpO1xyXG4gICAgICAgIHRoaXMuYXBwLnVzZSgnL2ZpbGVzJywgZXhwcmVzcy5zdGF0aWMoJ3VwbG9hZHMnKSk7XHJcbiAgICAgICAgdGhpcy5hcHAudXNlKGNvcnMoKSk7XHJcbiAgICAgICAgcm91dGVyKHRoaXMuYXBwKTtcclxuXHJcbiAgICAgICAgTG9nZ2VyLmluaXQoeyBsZXZlbDogQ29uZmlnLmxvZ3MubGV2ZWwgfSk7XHJcbiAgICAgICAgcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiVW5jYXVnaHQgRXhjZXB0aW9uIDogXCIpXHJcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpbml0aWFsaXplTWlkZGxld2FyZXMoKSB7XHJcbiAgICAgICAgdGhpcy5hcHAudXNlKGV4cHJlc3MuanNvbih7IGxpbWl0OiAnNTBtYicgfSkpO1xyXG4gICAgICAgIHRoaXMuYXBwLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBsaW1pdDogJzUwbWInLCBleHRlbmRlZDogdHJ1ZSwgcGFyYW1ldGVyTGltaXQ6IDUwMDAwIH0pKTtcclxuICAgICAgICB0aGlzLmFwcC51c2UoZXhwcmVzcy5qc29uKCkpO1xyXG4gICAgfVxyXG4gICAgbGlzdGVuKCkge1xyXG4gICAgICAgIHRoaXMuYXBwLmxpc3Rlbih0aGlzLnBvcnQsICgpID0+IHtcclxuICAgICAgICAgICAgTG9nZ2VyLmxvZyhcclxuICAgICAgICAgICAgICAgICdpbmZvJyxcclxuICAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcclxuICAgICAgICAgICAgICDwn5uh77iPICBTZXJ2ZXIgbGlzdGVuaW5nIG9uIHBvcnQ6ICR7dGhpcy5wb3J0fSDwn5uh77iPXHJcbiAgICAgICAgICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXHJcbiAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdfQ==