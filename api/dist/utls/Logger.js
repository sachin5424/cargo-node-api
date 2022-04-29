"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _winston = _interopRequireDefault(require("winston"));

require("winston-daily-rotate-file");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let LoggerInstance = null;

const stringifyProperties = info => {
  const skip = ['message', 'timestamp', 'level'];
  let response = '';

  for (const key in info) {
    if (Object.prototype.hasOwnProperty.call(info, key)) {
      const value = info[key];

      if (!skip.includes(key) && value) {
        response += `${key}=${value}`;
      }
    }
  }

  return response;
};

class Logger {
  static init({
    transports = [],
    level = 'info',
    defaultMeta = {}
  } = {}) {
    if (!_lodash.default.isArray(transports)) {
      throw new Error('transports is not an array');
    }

    if (!Object.keys(_winston.default.config.npm.levels).includes(level)) {
      throw new Error('invalid level');
    }

    if (!_lodash.default.isObject(defaultMeta) || _lodash.default.isArray(defaultMeta)) {
      throw new Error('invalid default meta');
    }

    if (_lodash.default.isEmpty(transports)) {
      if (false && _config.default.IsLocal) {
        transports.push(new _winston.default.transports.Console({
          format: _winston.default.format.combine(_winston.default.format.cli(), _winston.default.format.simple())
        }));
      } else {
        const fileTransport = new _winston.default.transports.DailyRotateFile({
          filename: `${_config.default.logDir}/app.%DATE%.log`,
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          handleExceptions: true,
          json: true,
          maxSize: '20m',
          maxFiles: '15d' // format: winston.format.json(),

        });
        transports.push(
        /* new winston.transports.Console({ format: winston.format.json() }), */
        // To log into console
        fileTransport);
      }
    }

    const loggerlevels = {
      fatal: 0,
      alert: 1,
      error: 2,
      warning: 3,
      info: 4,
      debug: 5,
      trace: 6
    };
    LoggerInstance = _winston.default.createLogger({
      level: level || 'info',
      levels: loggerlevels,
      format: _winston.default.format.combine(_winston.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
        alias: '@timestamp'
      }), _winston.default.format.errors({
        stack: true
      }), _winston.default.format.splat(), _winston.default.format.json(), _winston.default.format.printf(info => `@ ${info.timestamp} - ${info.level}: ${info.message} ${stringifyProperties(info)}`)),
      transports,
      defaultMeta
    });
  }

  static log(level, message, meta = {}) {
    if (!_lodash.default.isObject(meta)) {
      meta = {
        meta
      };
    } else if (meta.message) {
      message += ' ';
    }

    LoggerInstance.log(level, message, meta);
  }

  static info(message, meta = {}) {
    Logger.log('info', message, meta);
  }

  static error(message, meta = {}) {
    Logger.log('error', message, meta);
  }

}

exports.default = Logger;