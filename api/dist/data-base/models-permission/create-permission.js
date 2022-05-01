"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autuGenratePermission = void 0;

var _index = require("../index");

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const method_flag = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT'
};

var autuGenratePermission = async () => {
  _mongoose.default.connection.on('open', async function (ref) {
    console.log('Connected to mongo server.'); //trying to get collection names

    _mongoose.default.connection.db.listCollections().toArray(async function (err, collectionName) {
      for (var i = 0; i < collectionName.length; i++) {
        console.log(collectionName[i].name); // [{ name: 'dbname.myCollection' }]

        /*
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                  create add permission
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        */

        console.log(collectionName[i]);
        var add_permission = {
          title: "add_" + collectionName[i].name,
          model_name: collectionName[i].name,
          method: method_flag.POST
        };
        var findAddPermission = await _index.UserAuthPermission.find(add_permission);

        if (findAddPermission.length == 0) {
          const createPermission = new _index.UserAuthPermission(add_permission);
          await createPermission.save();
          console.log(createPermission);
        }
        /*
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                  end add permission
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        */
        //////////////////////////////////  :: NEXT :://////////////////////////////////////////////////////////

        /*
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                  create Delete permission
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        */


        var delete_permission = {
          title: "delete_" + collectionName[i].name,
          model_name: collectionName[i].name,
          method: method_flag.DELETE
        };
        var findDeletePermission = await _index.UserAuthPermission.find(delete_permission);

        if (findDeletePermission.length == 0) {
          const deletePermission = new _index.UserAuthPermission(delete_permission);
          await deletePermission.save();
        }
        /*
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                  create Delete permission
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        */
        //////////////////////////////////  :: NEXT :://////////////////////////////////////////////////////////

        /*
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                  create Change permission
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        */


        var change_permission = {
          title: "change_" + collectionName[i].name,
          model_name: collectionName[i].name,
          method: method_flag.PUT
        };
        var findChangePermission = await _index.UserAuthPermission.find(change_permission);

        if (findChangePermission.length == 0) {
          const changePermission = new _index.UserAuthPermission(change_permission);
          await changePermission.save();
        }
        /*
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                  End Change permission
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        */
        //////////////////////////////////  :: NEXT :://////////////////////////////////////////////////////////

        /*
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                  CREAT VIEW PERMISSION
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        */


        var view_permission = {
          title: "view_" + collectionName[i].name,
          model_name: collectionName[i].name,
          method: method_flag.GET
        };
        var findViewPermission = await _index.UserAuthPermission.find(view_permission);

        if (findViewPermission.length == 0) {
          const viewPermission = new _index.UserAuthPermission(view_permission);
          await viewPermission.save();
        }
        /*
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                                  End Change permission
        :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        */

      }
    });
  });
};

exports.autuGenratePermission = autuGenratePermission;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYXRhLWJhc2UvbW9kZWxzLXBlcm1pc3Npb24vY3JlYXRlLXBlcm1pc3Npb24uanMiXSwibmFtZXMiOlsibWV0aG9kX2ZsYWciLCJHRVQiLCJQT1NUIiwiREVMRVRFIiwiUFVUIiwiYXV0dUdlbnJhdGVQZXJtaXNzaW9uIiwibW9uZ29vc2UiLCJjb25uZWN0aW9uIiwib24iLCJyZWYiLCJjb25zb2xlIiwibG9nIiwiZGIiLCJsaXN0Q29sbGVjdGlvbnMiLCJ0b0FycmF5IiwiZXJyIiwiY29sbGVjdGlvbk5hbWUiLCJpIiwibGVuZ3RoIiwibmFtZSIsImFkZF9wZXJtaXNzaW9uIiwidGl0bGUiLCJtb2RlbF9uYW1lIiwibWV0aG9kIiwiZmluZEFkZFBlcm1pc3Npb24iLCJVc2VyQXV0aFBlcm1pc3Npb24iLCJmaW5kIiwiY3JlYXRlUGVybWlzc2lvbiIsInNhdmUiLCJkZWxldGVfcGVybWlzc2lvbiIsImZpbmREZWxldGVQZXJtaXNzaW9uIiwiZGVsZXRlUGVybWlzc2lvbiIsImNoYW5nZV9wZXJtaXNzaW9uIiwiZmluZENoYW5nZVBlcm1pc3Npb24iLCJjaGFuZ2VQZXJtaXNzaW9uIiwidmlld19wZXJtaXNzaW9uIiwiZmluZFZpZXdQZXJtaXNzaW9uIiwidmlld1Blcm1pc3Npb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBLE1BQU1BLFdBQVcsR0FBRztBQUNoQkMsRUFBQUEsR0FBRyxFQUFFLEtBRFc7QUFFaEJDLEVBQUFBLElBQUksRUFBRSxNQUZVO0FBR2hCQyxFQUFBQSxNQUFNLEVBQUUsUUFIUTtBQUloQkMsRUFBQUEsR0FBRyxFQUFFO0FBSlcsQ0FBcEI7O0FBTUEsSUFBSUMscUJBQXFCLEdBQUcsWUFBWTtBQUNwQ0Msb0JBQVNDLFVBQVQsQ0FBb0JDLEVBQXBCLENBQXVCLE1BQXZCLEVBQStCLGdCQUFnQkMsR0FBaEIsRUFBcUI7QUFDaERDLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDRC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Z0IsWUFBSU8sZUFBZSxHQUFHO0FBQ2xCZCxVQUFBQSxLQUFLLEVBQUUsVUFBVUwsY0FBYyxDQUFDQyxDQUFELENBQWQsQ0FBa0JFLElBRGpCO0FBRWxCRyxVQUFBQSxVQUFVLEVBQUVOLGNBQWMsQ0FBQ0MsQ0FBRCxDQUFkLENBQWtCRSxJQUZaO0FBR2xCSSxVQUFBQSxNQUFNLEVBQUV2QixXQUFXLENBQUNDO0FBSEYsU0FBdEI7QUFLQSxZQUFJbUMsa0JBQWtCLEdBQUcsTUFBTVgsMEJBQW1CQyxJQUFuQixDQUF3QlMsZUFBeEIsQ0FBL0I7O0FBQ0EsWUFBSUMsa0JBQWtCLENBQUNsQixNQUFuQixJQUE2QixDQUFqQyxFQUFvQztBQUNoQyxnQkFBTW1CLGNBQWMsR0FBRyxJQUFJWix5QkFBSixDQUF1QlUsZUFBdkIsQ0FBdkI7QUFDQSxnQkFBTUUsY0FBYyxDQUFDVCxJQUFmLEVBQU47QUFDSDtBQUNEO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUNhO0FBQ0osS0F6RkQ7QUEwRkgsR0E3RkQ7QUE4RkgsQ0EvRkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVc2VyQXV0aFBlcm1pc3Npb24gfSBmcm9tICcuLi9pbmRleCc7XHJcbmltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcbmNvbnN0IG1ldGhvZF9mbGFnID0ge1xyXG4gICAgR0VUOiAnR0VUJyxcclxuICAgIFBPU1Q6ICdQT1NUJyxcclxuICAgIERFTEVURTogJ0RFTEVURScsXHJcbiAgICBQVVQ6ICdQVVQnXHJcbn07XHJcbnZhciBhdXR1R2VucmF0ZVBlcm1pc3Npb24gPSBhc3luYyAoKSA9PiB7XHJcbiAgICBtb25nb29zZS5jb25uZWN0aW9uLm9uKCdvcGVuJywgYXN5bmMgZnVuY3Rpb24gKHJlZikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0ZWQgdG8gbW9uZ28gc2VydmVyLicpO1xyXG4gICAgICAgIC8vdHJ5aW5nIHRvIGdldCBjb2xsZWN0aW9uIG5hbWVzXHJcbiAgICAgICAgbW9uZ29vc2UuY29ubmVjdGlvbi5kYi5saXN0Q29sbGVjdGlvbnMoKS50b0FycmF5KGFzeW5jIGZ1bmN0aW9uIChlcnIsIGNvbGxlY3Rpb25OYW1lKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sbGVjdGlvbk5hbWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbGxlY3Rpb25OYW1lW2ldLm5hbWUpOyAvLyBbeyBuYW1lOiAnZGJuYW1lLm15Q29sbGVjdGlvbicgfV1cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZSBhZGQgcGVybWlzc2lvblxyXG4gICAgICAgICAgICAgICAgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbGxlY3Rpb25OYW1lW2ldKTtcclxuICAgICAgICAgICAgICAgIHZhciBhZGRfcGVybWlzc2lvbiA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJhZGRfXCIgKyBjb2xsZWN0aW9uTmFtZVtpXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsX25hbWU6IGNvbGxlY3Rpb25OYW1lW2ldLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2RfZmxhZy5QT1NULFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHZhciBmaW5kQWRkUGVybWlzc2lvbiA9IGF3YWl0IFVzZXJBdXRoUGVybWlzc2lvbi5maW5kKGFkZF9wZXJtaXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIGlmIChmaW5kQWRkUGVybWlzc2lvbi5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZVBlcm1pc3Npb24gPSBuZXcgVXNlckF1dGhQZXJtaXNzaW9uKGFkZF9wZXJtaXNzaW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjcmVhdGVQZXJtaXNzaW9uLnNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjcmVhdGVQZXJtaXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZCBhZGQgcGVybWlzc2lvblxyXG4gICAgICAgICAgICAgICAgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gIDo6IE5FWFQgOjovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGUgRGVsZXRlIHBlcm1pc3Npb25cclxuICAgICAgICAgICAgICAgIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgZGVsZXRlX3Blcm1pc3Npb24gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiZGVsZXRlX1wiICsgY29sbGVjdGlvbk5hbWVbaV0ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbF9uYW1lOiBjb2xsZWN0aW9uTmFtZVtpXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kX2ZsYWcuREVMRVRFLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHZhciBmaW5kRGVsZXRlUGVybWlzc2lvbiA9IGF3YWl0IFVzZXJBdXRoUGVybWlzc2lvbi5maW5kKGRlbGV0ZV9wZXJtaXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIGlmIChmaW5kRGVsZXRlUGVybWlzc2lvbi5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZVBlcm1pc3Npb24gPSBuZXcgVXNlckF1dGhQZXJtaXNzaW9uKGRlbGV0ZV9wZXJtaXNzaW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBkZWxldGVQZXJtaXNzaW9uLnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZSBEZWxldGUgcGVybWlzc2lvblxyXG4gICAgICAgICAgICAgICAgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gIDo6IE5FWFQgOjovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGUgQ2hhbmdlIHBlcm1pc3Npb25cclxuICAgICAgICAgICAgICAgIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgY2hhbmdlX3Blcm1pc3Npb24gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiY2hhbmdlX1wiICsgY29sbGVjdGlvbk5hbWVbaV0ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbF9uYW1lOiBjb2xsZWN0aW9uTmFtZVtpXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kX2ZsYWcuUFVULFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHZhciBmaW5kQ2hhbmdlUGVybWlzc2lvbiA9IGF3YWl0IFVzZXJBdXRoUGVybWlzc2lvbi5maW5kKGNoYW5nZV9wZXJtaXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIGlmIChmaW5kQ2hhbmdlUGVybWlzc2lvbi5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoYW5nZVBlcm1pc3Npb24gPSBuZXcgVXNlckF1dGhQZXJtaXNzaW9uKGNoYW5nZV9wZXJtaXNzaW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjaGFuZ2VQZXJtaXNzaW9uLnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVuZCBDaGFuZ2UgcGVybWlzc2lvblxyXG4gICAgICAgICAgICAgICAgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gIDo6IE5FWFQgOjovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDUkVBVCBWSUVXIFBFUk1JU1NJT05cclxuICAgICAgICAgICAgICAgIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgdmlld19wZXJtaXNzaW9uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInZpZXdfXCIgKyBjb2xsZWN0aW9uTmFtZVtpXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsX25hbWU6IGNvbGxlY3Rpb25OYW1lW2ldLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2RfZmxhZy5HRVQsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpbmRWaWV3UGVybWlzc2lvbiA9IGF3YWl0IFVzZXJBdXRoUGVybWlzc2lvbi5maW5kKHZpZXdfcGVybWlzc2lvbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmluZFZpZXdQZXJtaXNzaW9uLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgdmlld1Blcm1pc3Npb24gPSBuZXcgVXNlckF1dGhQZXJtaXNzaW9uKHZpZXdfcGVybWlzc2lvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdmlld1Blcm1pc3Npb24uc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIDo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRW5kIENoYW5nZSBwZXJtaXNzaW9uXHJcbiAgICAgICAgICAgICAgICA6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6XHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuZXhwb3J0IHsgYXV0dUdlbnJhdGVQZXJtaXNzaW9uIH07Il19