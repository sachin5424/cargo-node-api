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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGxzL0xvZ2dlci5qcyJdLCJuYW1lcyI6WyJMb2dnZXJJbnN0YW5jZSIsInN0cmluZ2lmeVByb3BlcnRpZXMiLCJpbmZvIiwic2tpcCIsInJlc3BvbnNlIiwia2V5IiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwidmFsdWUiLCJpbmNsdWRlcyIsIkxvZ2dlciIsImluaXQiLCJ0cmFuc3BvcnRzIiwibGV2ZWwiLCJkZWZhdWx0TWV0YSIsIl8iLCJpc0FycmF5IiwiRXJyb3IiLCJrZXlzIiwid2luc3RvbiIsImNvbmZpZyIsIm5wbSIsImxldmVscyIsImlzT2JqZWN0IiwiaXNFbXB0eSIsIkNvbmZpZyIsIklzTG9jYWwiLCJwdXNoIiwiQ29uc29sZSIsImZvcm1hdCIsImNvbWJpbmUiLCJjbGkiLCJzaW1wbGUiLCJmaWxlVHJhbnNwb3J0IiwiRGFpbHlSb3RhdGVGaWxlIiwiZmlsZW5hbWUiLCJsb2dEaXIiLCJkYXRlUGF0dGVybiIsInppcHBlZEFyY2hpdmUiLCJoYW5kbGVFeGNlcHRpb25zIiwianNvbiIsIm1heFNpemUiLCJtYXhGaWxlcyIsImxvZ2dlcmxldmVscyIsImZhdGFsIiwiYWxlcnQiLCJlcnJvciIsIndhcm5pbmciLCJkZWJ1ZyIsInRyYWNlIiwiY3JlYXRlTG9nZ2VyIiwidGltZXN0YW1wIiwiYWxpYXMiLCJlcnJvcnMiLCJzdGFjayIsInNwbGF0IiwicHJpbnRmIiwibWVzc2FnZSIsImxvZyIsIm1ldGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7OztBQUVBLElBQUlBLGNBQWMsR0FBRyxJQUFyQjs7QUFFQSxNQUFNQyxtQkFBbUIsR0FBR0MsSUFBSSxJQUFJO0FBQ25DLFFBQU1DLElBQUksR0FBRyxDQUFDLFNBQUQsRUFBWSxXQUFaLEVBQXlCLE9BQXpCLENBQWI7QUFDQSxNQUFJQyxRQUFRLEdBQUcsRUFBZjs7QUFFQSxPQUFLLE1BQU1DLEdB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RSxJQUFuQztBQUNBOztBQUVVLFNBQUozRCxJQUFJLENBQUN5RCxPQUFELEVBQVVFLElBQUksR0FBRyxFQUFqQixFQUFxQjtBQUMvQmpELElBQUFBLE1BQU0sQ0FBQ2dELEdBQVAsQ0FBVyxNQUFYLEVBQW1CRCxPQUFuQixFQUE0QkUsSUFBNUI7QUFDQTs7QUFFVyxTQUFMYixLQUFLLENBQUNXLE9BQUQsRUFBVUUsSUFBSSxHQUFHLEVBQWpCLEVBQXFCO0FBQ2hDakQsSUFBQUEsTUFBTSxDQUFDZ0QsR0FBUCxDQUFXLE9BQVgsRUFBb0JELE9BQXBCLEVBQTZCRSxJQUE3QjtBQUNBOztBQXJGMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XHJcbmltcG9ydCB3aW5zdG9uIGZyb20gXCJ3aW5zdG9uXCI7XHJcbmltcG9ydCBcIndpbnN0b24tZGFpbHktcm90YXRlLWZpbGVcIjtcclxuXHJcbmltcG9ydCBDb25maWcgZnJvbSAnLi9jb25maWcnO1xyXG5cclxubGV0IExvZ2dlckluc3RhbmNlID0gbnVsbDtcclxuXHJcbmNvbnN0IHN0cmluZ2lmeVByb3BlcnRpZXMgPSBpbmZvID0+IHtcclxuXHRjb25zdCBza2lwID0gWydtZXNzYWdlJywgJ3RpbWVzdGFtcCcsICdsZXZlbCddO1xyXG5cdGxldCByZXNwb25zZSA9ICcnO1xyXG5cclxuXHRmb3IgKGNvbnN0IGtleSBpbiBpbmZvKSB7XHJcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGluZm8sIGtleSkpIHtcclxuXHRcdFx0Y29uc3QgdmFsdWUgPSBpbmZvW2tleV07XHJcblx0XHRcdGlmICghc2tpcC5pbmNsdWRlcyhrZXkpICYmIHZhbHVlKSB7XHJcblx0XHRcdFx0cmVzcG9uc2UgKz0gYCR7a2V5fT0ke3ZhbHVlfWA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiByZXNwb25zZTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2dlciB7XHJcblx0c3RhdGljIGluaXQoeyB0cmFuc3BvcnRzID0gW10sIGxldmVsID0gJ2luZm8nLCBkZWZhdWx0TWV0YSA9IHt9IH0gPSB7fSkge1xyXG5cdFx0aWYgKCFfLmlzQXJyYXkodHJhbnNwb3J0cykpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCd0cmFuc3BvcnRzIGlzIG5vdCBhbiBhcnJheScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghT2JqZWN0LmtleXMod2luc3Rvbi5jb25maWcubnBtLmxldmVscykuaW5jbHVkZXMobGV2ZWwpKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignaW52YWxpZCBsZXZlbCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghXy5pc09iamVjdChkZWZhdWx0TWV0YSkgfHwgXy5pc0FycmF5KGRlZmF1bHRNZXRhKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZGVmYXVsdCBtZXRhJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKF8uaXNFbXB0eSh0cmFuc3BvcnRzKSkge1xyXG5cdFx0XHRpZiAoZmFsc2UgJiYgQ29uZmlnLklzTG9jYWwpIHtcclxuXHRcdFx0XHR0cmFuc3BvcnRzLnB1c2goXHJcblx0XHRcdFx0XHRuZXcgd2luc3Rvbi50cmFuc3BvcnRzLkNvbnNvbGUoe1xyXG5cdFx0XHRcdFx0XHRmb3JtYXQ6IHdpbnN0b24uZm9ybWF0LmNvbWJpbmUod2luc3Rvbi5mb3JtYXQuY2xpKCksIHdpbnN0b24uZm9ybWF0LnNpbXBsZSgpKSxcclxuXHRcdFx0XHRcdH0pLFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc3QgZmlsZVRyYW5zcG9ydCA9IG5ldyB3aW5zdG9uLnRyYW5zcG9ydHMuRGFpbHlSb3RhdGVGaWxlKHtcclxuXHRcdFx0XHRcdGZpbGVuYW1lOiBgJHtDb25maWcubG9nRGlyfS9hcHAuJURBVEUlLmxvZ2AsXHJcblx0XHRcdFx0XHRkYXRlUGF0dGVybjogJ1lZWVktTU0tREQtSEgnLFxyXG5cdFx0XHRcdFx0emlwcGVkQXJjaGl2ZTogdHJ1ZSxcclxuXHRcdFx0XHRcdGhhbmRsZUV4Y2VwdGlvbnM6IHRydWUsXHJcblx0XHRcdFx0XHRqc29uOiB0cnVlLFxyXG5cdFx0XHRcdFx0bWF4U2l6ZTogJzIwbScsXHJcblx0XHRcdFx0XHRtYXhGaWxlczogJzE1ZCcsXHJcblx0XHRcdFx0XHQvLyBmb3JtYXQ6IHdpbnN0b24uZm9ybWF0Lmpzb24oKSxcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0dHJhbnNwb3J0cy5wdXNoKFxyXG5cdFx0XHRcdFx0LyogbmV3IHdpbnN0b24udHJhbnNwb3J0cy5Db25zb2xlKHsgZm9ybWF0OiB3aW5zdG9uLmZvcm1hdC5qc29uKCkgfSksICovIC8vIFRvIGxvZyBpbnRvIGNvbnNvbGVcclxuXHRcdFx0XHRcdGZpbGVUcmFuc3BvcnRcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgbG9nZ2VybGV2ZWxzID0ge1xyXG5cdFx0XHRmYXRhbDogMCxcclxuXHRcdFx0YWxlcnQ6IDEsXHJcblx0XHRcdGVycm9yOiAyLFxyXG5cdFx0XHR3YXJuaW5nOiAzLFxyXG5cdFx0XHRpbmZvOiA0LFxyXG5cdFx0XHRkZWJ1ZzogNSxcclxuXHRcdFx0dHJhY2U6IDYsXHJcblx0XHR9O1xyXG5cdFx0TG9nZ2VySW5zdGFuY2UgPSB3aW5zdG9uLmNyZWF0ZUxvZ2dlcih7XHJcblx0XHRcdGxldmVsOiBsZXZlbCB8fCAnaW5mbycsXHJcblx0XHRcdGxldmVsczogbG9nZ2VybGV2ZWxzLFxyXG5cdFx0XHRmb3JtYXQ6IHdpbnN0b24uZm9ybWF0LmNvbWJpbmUoXHJcblx0XHRcdFx0d2luc3Rvbi5mb3JtYXQudGltZXN0YW1wKHtcclxuXHRcdFx0XHRcdGZvcm1hdDogJ1lZWVktTU0tREQgSEg6bW06c3MnLFxyXG5cdFx0XHRcdFx0YWxpYXM6ICdAdGltZXN0YW1wJyxcclxuXHRcdFx0XHR9KSxcclxuXHRcdFx0XHR3aW5zdG9uLmZvcm1hdC5lcnJvcnMoeyBzdGFjazogdHJ1ZSB9KSxcclxuXHRcdFx0XHR3aW5zdG9uLmZvcm1hdC5zcGxhdCgpLFxyXG5cdFx0XHRcdHdpbnN0b24uZm9ybWF0Lmpzb24oKSxcclxuXHRcdFx0XHR3aW5zdG9uLmZvcm1hdC5wcmludGYoXHJcblx0XHRcdFx0XHRpbmZvID0+IGBAICR7aW5mby50aW1lc3RhbXB9IC0gJHtpbmZvLmxldmVsfTogJHtpbmZvLm1lc3NhZ2V9ICR7c3RyaW5naWZ5UHJvcGVydGllcyhpbmZvKX1gLFxyXG5cdFx0XHRcdCksXHJcblx0XHRcdCksXHJcblx0XHRcdHRyYW5zcG9ydHMsXHJcblx0XHRcdGRlZmF1bHRNZXRhLFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgbG9nKGxldmVsLCBtZXNzYWdlLCBtZXRhID0ge30pIHtcclxuXHRcdGlmICghXy5pc09iamVjdChtZXRhKSkge1xyXG5cdFx0XHRtZXRhID0geyBtZXRhIH07XHJcblx0XHR9IGVsc2UgaWYgKG1ldGEubWVzc2FnZSkge1xyXG5cdFx0XHRtZXNzYWdlICs9ICcgJztcclxuXHRcdH1cclxuXHJcblx0XHRMb2dnZXJJbnN0YW5jZS5sb2cobGV2ZWwsIG1lc3NhZ2UsIG1ldGEpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGluZm8obWVzc2FnZSwgbWV0YSA9IHt9KSB7XHJcblx0XHRMb2dnZXIubG9nKCdpbmZvJywgbWVzc2FnZSwgbWV0YSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZXJyb3IobWVzc2FnZSwgbWV0YSA9IHt9KSB7XHJcblx0XHRMb2dnZXIubG9nKCdlcnJvcicsIG1lc3NhZ2UsIG1ldGEpO1xyXG5cdH1cclxufVxyXG4iXX0=