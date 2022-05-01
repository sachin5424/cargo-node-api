"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwtTokenPermission = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dataBase = require("../data-base");

var _Logger = _interopRequireDefault(require("../utls/Logger"));

var _config = _interopRequireDefault(require("./../utls/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jwtTokenPermission = async (req, res, next) => {
  try {
    var bearer = req.headers.authorization.split(" ");
    const token = bearer[1];

    var decode = _jsonwebtoken.default.verify(token, _config.default.jwt.secretKey);

    req.userId = decode.sub;

    try {
      const cuser = await _dataBase.UserModel.findById(decode.sub);
      req.__cuser = cuser;
      global.cuser = cuser;
      global.state = undefined;
      global.district = undefined;
      global.taluk = undefined;

      if (cuser.type === 'stateAdmin') {
        global.state = cuser.state;
      } else if (cuser.type === 'districtAdmin') {
        global.state = cuser.state;
        global.district = cuser.district;
      } else if (cuser.type === 'talukAdmin') {
        global.state = cuser.state;
        global.district = cuser.district;
        global.taluk = cuser.taluk;
      }
    } catch (e) {
      throw new Error('User does not exist');
    }

    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: "Failed to authenticate. Try login again!"
    });
  }
};

exports.jwtTokenPermission = jwtTokenPermission;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2p3dFRva2VuLmpzIl0sIm5hbWVzIjpbImp3dFRva2VuUGVybWlzc2lvbiIsInJlcSIsInJlcyIsIm5leHQiLCJiZWFyZXIiLCJoZWFkZXJzIiwiYXV0aG9yaXphdGlvbiIsInNwbGl0IiwidG9rZW4iLCJkZWNvZGUiLCJqd3QiLCJ2ZXJpZnkiLCJDb25maWciLCJzZWNyZXRLZXkiLCJ1c2VySWQiLCJzdWIiLCJjdXNlciIsIlVzZXJNb2RlbCIsImZpbmRCeUlkIiwiX19jdXNlciIsImdsb2JhbCIsInN0YXRlIiwidW5kZWZpbmVkIiwiZGlzdHJpY3QiLCJ0YWx1ayIsInR5cGUiLCJlIiwiRXJyb3IiLCJlcnJvciIsInN0YXR1cyIsImpzb24iLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFTyxNQUFNQSxrQkFBa0IsR0FBRyxPQUFPQyxHQUFQLEVBQVlDLEdBQVosRUFBaUJDLElBQWpCLEtBQTBCO0FBQzNELE1BQUk7QUFDSCxRQUFJQyxNQUFNLEdBQUdILEdBQUcsQ0FBQ0ksT0FBSixDQUFZQyxhQUFaLENBQTBCQyxLQUExQixDQUFnQyxHQUFoQyxDQUFiO0FBQ0EsVUFBTUMsS0FBSyxHQUFHSixNQUFNLENBQUMsQ0FBRCxDQUFwQjs7QUFDQSxRQUFJSyxNQUFNLEdBQUdDLHNCQUFJQyxNQUFKLENBQVdILEtBQVgsRUFBa0JJLGdCQUFPRixHQUFQLENBQVdHLFNBQTdCLENBQWI7O0FBQ0FaLElBQUFBLEdBQUcsQ0FBQ2EsTUFBSixHQUFhTCxNQUFNLENBQUNNLEdBQXBCOztBQUVBLFFBQUk7QUFDSCxZQUFNQyxLQUFLLEdBQUcsTUFBTUMsb0JBQVVDLFFBQVYsQ0FBbUJULE1BQU0sQ0FBQ00sR0FBMUIsQ0FBcEI7QUFDQWQsTUFBQUEsR0FBRyxDQUFDa0IsT0FBSixHQUFjSCxLQUFkO0FBQ0FJLE1BQUFBLE1BQU0sQ0FBQ0osS0FBUCxHQUFlQSxLQUFmO0FBQ0FJLE1BQUFBLE1BQU0sQ0FBQ0MsS0FBUCxHQUFlQyxTQUFmO0FBQ0FGLE1BQUFBLE1BQU0sQ0FBQ0csUUFBUCxHQUFrQkQsU0FBbEI7QUFDQUYsTUFBQUEsTUFBTSxDQUFDSSxLQUFQLEdBQWVGLFNBQWY7O0FBRUEsVUFBR04sS0FBSyxDQUFDUyxJQUFOLEtBQWEsWUFBaEIsRUFBNkI7QUFDNUJMLFFBQUFBLE1BQU0sQ0FBQ0MsS0FBUCxHQUFlTCxLQUFLLENBQUNLLEtBQXJCO0FBQ0EsT0FGRCxNQUVPLElBQUdMLEtBQUssQ0FBQ1MsSUFBTixLQUFhLGVBQWhCLEVBQWdDO0FBQ3RDTCxRQUFBQSxNQUFNLENBQUNDLEtBQVAsR0FBZUwsS0FBSyxDQUFDSyxLQUFyQjtBQUNBRCxRQUFBQSxNQUFNLENBQUNHLFFBQVAsR0FBa0JQLEtBQUssQ0FBQ08sUUFBeEI7QUFDQSxPQUhNLE1BR0EsSUFBR1AsS0FBSyxDQUFDUyxJQUFOLEtBQWEsWUFBaEIsRUFBNkI7QUFDbkNMLFFBQUFBLE1BQU0sQ0FBQ0MsS0FBUCxHQUFlTCxLQUFLLENBQUNLLEtBQXJCO0FBQ0FELFFBQUFBLE1BQU0sQ0FBQ0csUUFBUCxHQUFrQlAsS0FBSyxDQUFDTyxRQUF4QjtBQUNBSCxRQUFBQSxNQUFNLENBQUNJLEtBQVAsR0FBZVIsS0FBSyxDQUFDUSxLQUFyQjtBQUNBO0FBQ0QsS0FsQkQsQ0FrQkUsT0FBT0UsQ0FBUCxFQUFVO0FBQ1gsWUFBTSxJQUFJQyxLQUFKLENBQVUscUJBQVYsQ0FBTjtBQUNBOztBQUVEeEIsSUFBQUEsSUFBSTtBQUNKLEdBN0JELENBOEJBLE9BQU95QixLQUFQLEVBQWM7QUFDYjFCLElBQUFBLEdBQUcsQ0FBQzJCLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQjtBQUNwQkQsTUFBQUEsTUFBTSxFQUFFLEdBRFk7QUFFcEJFLE1BQUFBLE9BQU8sRUFBRTtBQUZXLEtBQXJCO0FBSUE7QUFDRCxDQXJDTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcclxuaW1wb3J0IHsgVXNlck1vZGVsIH0gZnJvbSAnLi4vZGF0YS1iYXNlJztcclxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi4vdXRscy9Mb2dnZXJcIjtcclxuaW1wb3J0IENvbmZpZyBmcm9tIFwiLi8uLi91dGxzL2NvbmZpZ1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGp3dFRva2VuUGVybWlzc2lvbiA9IGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xyXG5cdHRyeSB7XHJcblx0XHR2YXIgYmVhcmVyID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdChcIiBcIik7XHJcblx0XHRjb25zdCB0b2tlbiA9IGJlYXJlclsxXTtcclxuXHRcdHZhciBkZWNvZGUgPSBqd3QudmVyaWZ5KHRva2VuLCBDb25maWcuand0LnNlY3JldEtleSk7XHJcblx0XHRyZXEudXNlcklkID0gZGVjb2RlLnN1YjtcclxuXHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCBjdXNlciA9IGF3YWl0IFVzZXJNb2RlbC5maW5kQnlJZChkZWNvZGUuc3ViKTtcclxuXHRcdFx0cmVxLl9fY3VzZXIgPSBjdXNlcjtcclxuXHRcdFx0Z2xvYmFsLmN1c2VyID0gY3VzZXI7XHJcblx0XHRcdGdsb2JhbC5zdGF0ZSA9IHVuZGVmaW5lZDtcclxuXHRcdFx0Z2xvYmFsLmRpc3RyaWN0ID0gdW5kZWZpbmVkO1xyXG5cdFx0XHRnbG9iYWwudGFsdWsgPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0XHRpZihjdXNlci50eXBlPT09J3N0YXRlQWRtaW4nKXtcclxuXHRcdFx0XHRnbG9iYWwuc3RhdGUgPSBjdXNlci5zdGF0ZTtcclxuXHRcdFx0fSBlbHNlIGlmKGN1c2VyLnR5cGU9PT0nZGlzdHJpY3RBZG1pbicpe1xyXG5cdFx0XHRcdGdsb2JhbC5zdGF0ZSA9IGN1c2VyLnN0YXRlO1xyXG5cdFx0XHRcdGdsb2JhbC5kaXN0cmljdCA9IGN1c2VyLmRpc3RyaWN0O1xyXG5cdFx0XHR9IGVsc2UgaWYoY3VzZXIudHlwZT09PSd0YWx1a0FkbWluJyl7XHJcblx0XHRcdFx0Z2xvYmFsLnN0YXRlID0gY3VzZXIuc3RhdGU7XHJcblx0XHRcdFx0Z2xvYmFsLmRpc3RyaWN0ID0gY3VzZXIuZGlzdHJpY3Q7XHJcblx0XHRcdFx0Z2xvYmFsLnRhbHVrID0gY3VzZXIudGFsdWs7XHJcblx0XHRcdH1cclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdVc2VyIGRvZXMgbm90IGV4aXN0JylcclxuXHRcdH1cclxuXHJcblx0XHRuZXh0KCk7XHJcblx0fVxyXG5cdGNhdGNoIChlcnJvcikge1xyXG5cdFx0cmVzLnN0YXR1cyg0MDEpLmpzb24oe1xyXG5cdFx0XHRzdGF0dXM6IDQwMSxcclxuXHRcdFx0bWVzc2FnZTogXCJGYWlsZWQgdG8gYXV0aGVudGljYXRlLiBUcnkgbG9naW4gYWdhaW4hXCJcclxuXHRcdH0pO1xyXG5cdH1cclxufTtcclxuIl19