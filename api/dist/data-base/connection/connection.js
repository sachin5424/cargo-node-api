"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.databaseConnect = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _import = require("../../settings/import");

var _config = _interopRequireDefault(require("../../utls/config"));

var _Logger = _interopRequireDefault(require("../../utls/Logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_import.dotenv.config();

let databaseConnect = () => {
  // const connectionString = `mongodb://localhost:27017/cargo`;
  const connectionString = `mongodb+srv://${_config.default.database.user}:${_config.default.database.password}@cluster0.oiold.mongodb.net/${_config.default.database.name}?retryWrites=${_config.default.database.retryWrites}&w=majority`;
  console.log('connectionString', connectionString);

  _mongoose.default.connect(connectionString);

  _mongoose.default.connection.on('connected', function () {
    _Logger.default.info("Database Connected");
  });

  _mongoose.default.connection.on('error', function (err) {
    _Logger.default.error(`
            Error while connecting database
            Error reason: ${err.message}
        `);
  });

  _mongoose.default.connection.on('disconnected', function () {
    _Logger.default.info("Database Disconnected");
  });
}; // console.log(mongoose.listCollections())


exports.databaseConnect = databaseConnect;