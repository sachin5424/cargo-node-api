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