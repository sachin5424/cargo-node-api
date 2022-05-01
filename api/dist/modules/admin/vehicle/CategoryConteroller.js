"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _VehicleService = _interopRequireDefault(require("../../../services/VehicleService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import { VehicalCategorieModel } from '../../../data-base/index';
// import { createData, listPaginate } from '../../../services/test';
// import { slug } from '../../../utls/_helper';
class CategoryController {
  /*
      static async addVehicalCategorie(req, res) {
          try {
              const errors = validationResult(req);
              if (!errors.isEmpty()) {
                  return res.status(422).json({
                      message: errors.msg,
                      errors: errors.errors
                  });
              }
              else {
                  const payload = req.body;
                  const userRequest = req;
                  let logData = {
                      name: payload.name,
                      icon: payload.icon,
                      isdeleted: 0,
                      active: 1,
                  };
                  let options = {
                      name: payload.name,
                      icon: payload.icon,
                      isdeleted: 0,
                      active: 1,
                      slug: slug(payload.name),
                      activeLog: [
                          {
                              userId: userRequest.userId,
                              method: 'POST',
                              newData: JSON.stringify(logData)
                          }
                      ]
                  };
                  await createData(VehicalCategorieModel, options);
                  return res.status(200).json({ message: "create vehicale categoires" });
              }
          }
          catch (error) {
              return res.status(200).json({ error });
          }
      }
      static async getVehicalCategorie(req, res) {
          try {
              const _id = req.query.id;
              const logs = req.query.logs;
              const getquery = req.query;
              let select = '';
              logs ? '' : select = '-activeLog';
              let query = {
                  select: select
              };
              let options = {
                  page: getquery.page ? parseInt(getquery.page) : 1,
                  limit: getquery.limit ? parseInt(getquery.limit) : 50,
                  sort: {
                      _id: -1
                  }
              };
              // const data = await  VehicalCategorieModel.find(query).select(select)
              const data = await listPaginate(VehicalCategorieModel, query, options);
              return res.status(200).json({ data });
          }
          catch (error) {
              return res.status(500).json({ error });
          }
      }
      static async detailsVehicalCategorie(req, res) {
          try {
              const _id = req.params.id;
              const data = await VehicalCategorieModel.findOne({ _id });
              return res.status(200).json({ data });
          }
          catch (error) {
              return res.status(500).json({ error });
          }
      }
      static async updateVehicalCategorie(req, res) {
          try {
              const errors = validationResult(req);
              if (!errors.isEmpty()) {
                  return res.status(422).json({
                      message: errors.msg,
                      errors: errors.errors
                  });
              }
              else {
                  const _id = req.params.id;
                  const payload = req.body;
                  if (payload) {
                      const test_select = Object.keys(payload);
                      const chech_data = await VehicalCategorieModel.findOne({ _id }).select(test_select);
                      const userRequest = req;
                      let update = [
                          {
                              userId: userRequest.userId,
                              method: 'UPDATE',
                              oldData: JSON.stringify(chech_data),
                              newData: JSON.stringify(payload)
                          }
                      ];
                      await VehicalCategorieModel.updateOne({ _id }, payload);
                      await VehicalCategorieModel.updateOne({ _id }, { $push: { activeLog: update } });
                  }
                  return res.status(200).json({ message: "update data" });
              }
          }
          catch (error) {
              return res.status(500).json({ error });
          }
      }
      static async deleteVehicalCategorie(req, res) {
          try {
              const _id = req.params.id;
              const payload = req.body;
              const userRequest = req;
              let update = [
                  {
                      userId: userRequest.userId,
                      method: 'DELETED',
                      newData: JSON.stringify(payload)
                  }
              ];
              await VehicalCategorieModel.updateOne({ _id }, { isdeleted: 1 });
              await VehicalCategorieModel.updateOne({ _id });
              return res.status(200).json({ message: "delete data" });
          }
          catch (error) {
              return res.status(500).json({ error });
          }
      }
  
  */
  static async list(req, res) {
    try {
      const srvRes = await _VehicleService.default.listVehicleCategory(req?.query, req.params);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async save(req, res) {
    try {
      const srvRes = await _VehicleService.default.saveVehicleCategory(req.body);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const srvRes = await _VehicleService.default.deleteVehicleCategory(req.params.id);
      return res.status(srvRes.statusCode).json(_objectSpread({}, srvRes));
    } catch (e) {
      return res.status(400).send({
        message: e.message
      });
    }
  }

}

exports.default = CategoryController;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2FkbWluL3ZlaGljbGUvQ2F0ZWdvcnlDb250ZXJvbGxlci5qcyJdLCJuYW1lcyI6WyJDYXRlZ29yeUNvbnRyb2xsZXIiLCJsaXN0IiwicmVxIiwicmVzIiwic3J2UmVzIiwiU2VydmljZSIsImxpc3RWZWhpY2xlQ2F0ZWdvcnkiLCJxdWVyeSIsInBhcmFtcyIsInN0YXR1cyIsInN0YXR1c0NvZGUiLCJqc29uIiwiZSIsInNlbmQiLCJtZXNzYWdlIiwic2F2ZSIsInNhdmVWZWhpY2xlQ2F0ZWdvcnkiLCJib2R5IiwiZGVsZXRlIiwiZGVsZXRlVmVoaWNsZUNhdGVnb3J5IiwiaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUVlLE1BQU1BLGtCQUFOLENBQXlCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNxQixlQUFKQyxJQUFJLENBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXO0FBQ3hCLFFBQUk7QUFDVCxZQUFNQyxNQUFNLEdBQUcsTUFBTUMsd0JBQVFDLG1CQUFSLENBQTRCSixHQUFHLEVBQUVLLEtBQWpDLEVBQXdDTCxHQUFHLENBQUNNLE1BQTVDLENBQXJCO0FBQ1MsYUFBT0wsR0FBRyxDQUFDTSxNQUFKLENBQVdMLE1BQU0sQ0FBQ00sVUFBbEIsRUFBOEJDLElBQTlCLG1CQUF3Q1AsTUFBeEMsRUFBUDtBQUNILEtBSEQsQ0FHRSxPQUFPUSxDQUFQLEVBQVU7QUFDakIsYUFBT1QsR0FBRyxDQUFDTSxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBRWdCLGVBQUpDLElBQUksQ0FBQ2IsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDeEIsUUFBSTtBQUNULFlBQU1DLE1BQU0sR0FBRyxNQUFNQyx3QkFBUVcsbUJBQVIsQ0FBNEJkLEdBQUcsQ0FBQ2UsSUFBaEMsQ0FBckI7QUFDUyxhQUFPZCxHQUFHLENBQUNNLE1BQUosQ0FBV0wsTUFBTSxDQUFDTSxVQUFsQixFQUE4QkMsSUFBOUIsbUJBQXdDUCxNQUF4QyxFQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9RLENBQVAsRUFBVTtBQUNqQixhQUFPVCxHQUFHLENBQUNNLE1BQUosQ0FBVyxHQUFYLEVBQWdCSSxJQUFoQixDQUFxQjtBQUFDQyxRQUFBQSxPQUFPLEVBQUVGLENBQUMsQ0FBQ0U7QUFBWixPQUFyQixDQUFQO0FBQ0E7QUFDRTs7QUFFa0IsZUFBTkksTUFBTSxDQUFDaEIsR0FBRCxFQUFNQyxHQUFOLEVBQVc7QUFDMUIsUUFBSTtBQUNULFlBQU1DLE1BQU0sR0FBRyxNQUFNQyx3QkFBUWMscUJBQVIsQ0FBOEJqQixHQUFHLENBQUNNLE1BQUosQ0FBV1ksRUFBekMsQ0FBckI7QUFDUyxhQUFPakIsR0FBRyxDQUFDTSxNQUFKLENBQVdMLE1BQU0sQ0FBQ00sVUFBbEIsRUFBOEJDLElBQTlCLG1CQUF3Q1AsTUFBeEMsRUFBUDtBQUNILEtBSEQsQ0FHRSxPQUFPUSxDQUFQLEVBQVU7QUFDakIsYUFBT1QsR0FBRyxDQUFDTSxNQUFKLENBQVcsR0FBWCxFQUFnQkksSUFBaEIsQ0FBcUI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFRixDQUFDLENBQUNFO0FBQVosT0FBckIsQ0FBUDtBQUNBO0FBQ0U7O0FBOUptQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL1ZlaGljbGVTZXJ2aWNlJztcclxuLy8gaW1wb3J0IHsgVmVoaWNhbENhdGVnb3JpZU1vZGVsIH0gZnJvbSAnLi4vLi4vLi4vZGF0YS1iYXNlL2luZGV4JztcclxuLy8gaW1wb3J0IHsgY3JlYXRlRGF0YSwgbGlzdFBhZ2luYXRlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvdGVzdCc7XHJcbi8vIGltcG9ydCB7IHNsdWcgfSBmcm9tICcuLi8uLi8uLi91dGxzL19oZWxwZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2F0ZWdvcnlDb250cm9sbGVyIHtcclxuLypcclxuICAgIHN0YXRpYyBhc3luYyBhZGRWZWhpY2FsQ2F0ZWdvcmllKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xyXG4gICAgICAgICAgICBpZiAoIWVycm9ycy5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQyMikuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JzLm1zZyxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnM6IGVycm9ycy5lcnJvcnNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHJlcS5ib2R5O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlclJlcXVlc3QgPSByZXE7XHJcbiAgICAgICAgICAgICAgICBsZXQgbG9nRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBwYXlsb2FkLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogcGF5bG9hZC5pY29uLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzZGVsZXRlZDogMCxcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmU6IDEsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogcGF5bG9hZC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246IHBheWxvYWQuaWNvbixcclxuICAgICAgICAgICAgICAgICAgICBpc2RlbGV0ZWQ6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNsdWc6IHNsdWcocGF5bG9hZC5uYW1lKSxcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVMb2c6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyUmVxdWVzdC51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RhdGE6IEpTT04uc3RyaW5naWZ5KGxvZ0RhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgY3JlYXRlRGF0YShWZWhpY2FsQ2F0ZWdvcmllTW9kZWwsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgbWVzc2FnZTogXCJjcmVhdGUgdmVoaWNhbGUgY2F0ZWdvaXJlc1wiIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBlcnJvciB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0VmVoaWNhbENhdGVnb3JpZShyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IF9pZCA9IHJlcS5xdWVyeS5pZDtcclxuICAgICAgICAgICAgY29uc3QgbG9ncyA9IHJlcS5xdWVyeS5sb2dzO1xyXG4gICAgICAgICAgICBjb25zdCBnZXRxdWVyeSA9IHJlcS5xdWVyeTtcclxuICAgICAgICAgICAgbGV0IHNlbGVjdCA9ICcnO1xyXG4gICAgICAgICAgICBsb2dzID8gJycgOiBzZWxlY3QgPSAnLWFjdGl2ZUxvZyc7XHJcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdDogc2VsZWN0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgcGFnZTogZ2V0cXVlcnkucGFnZSA/IHBhcnNlSW50KGdldHF1ZXJ5LnBhZ2UpIDogMSxcclxuICAgICAgICAgICAgICAgIGxpbWl0OiBnZXRxdWVyeS5saW1pdCA/IHBhcnNlSW50KGdldHF1ZXJ5LmxpbWl0KSA6IDUwLFxyXG4gICAgICAgICAgICAgICAgc29ydDoge1xyXG4gICAgICAgICAgICAgICAgICAgIF9pZDogLTFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gY29uc3QgZGF0YSA9IGF3YWl0ICBWZWhpY2FsQ2F0ZWdvcmllTW9kZWwuZmluZChxdWVyeSkuc2VsZWN0KHNlbGVjdClcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGxpc3RQYWdpbmF0ZShWZWhpY2FsQ2F0ZWdvcmllTW9kZWwsIHF1ZXJ5LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZGF0YSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBkZXRhaWxzVmVoaWNhbENhdGVnb3JpZShyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IF9pZCA9IHJlcS5wYXJhbXMuaWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBWZWhpY2FsQ2F0ZWdvcmllTW9kZWwuZmluZE9uZSh7IF9pZCB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZGF0YSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyB1cGRhdGVWZWhpY2FsQ2F0ZWdvcmllKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGlvblJlc3VsdChyZXEpO1xyXG4gICAgICAgICAgICBpZiAoIWVycm9ycy5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQyMikuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JzLm1zZyxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnM6IGVycm9ycy5lcnJvcnNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgX2lkID0gcmVxLnBhcmFtcy5pZDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSByZXEuYm9keTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVzdF9zZWxlY3QgPSBPYmplY3Qua2V5cyhwYXlsb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVjaF9kYXRhID0gYXdhaXQgVmVoaWNhbENhdGVnb3JpZU1vZGVsLmZpbmRPbmUoeyBfaWQgfSkuc2VsZWN0KHRlc3Rfc2VsZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyUmVxdWVzdCA9IHJlcTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXBkYXRlID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJSZXF1ZXN0LnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1VQREFURScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGREYXRhOiBKU09OLnN0cmluZ2lmeShjaGVjaF9kYXRhKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0RhdGE6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFZlaGljYWxDYXRlZ29yaWVNb2RlbC51cGRhdGVPbmUoeyBfaWQgfSwgcGF5bG9hZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgVmVoaWNhbENhdGVnb3JpZU1vZGVsLnVwZGF0ZU9uZSh7IF9pZCB9LCB7ICRwdXNoOiB7IGFjdGl2ZUxvZzogdXBkYXRlIH0gfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBtZXNzYWdlOiBcInVwZGF0ZSBkYXRhXCIgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBkZWxldGVWZWhpY2FsQ2F0ZWdvcmllKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgX2lkID0gcmVxLnBhcmFtcy5pZDtcclxuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHJlcS5ib2R5O1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyUmVxdWVzdCA9IHJlcTtcclxuICAgICAgICAgICAgbGV0IHVwZGF0ZSA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJSZXF1ZXN0LnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEVEJyxcclxuICAgICAgICAgICAgICAgICAgICBuZXdEYXRhOiBKU09OLnN0cmluZ2lmeShwYXlsb2FkKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBhd2FpdCBWZWhpY2FsQ2F0ZWdvcmllTW9kZWwudXBkYXRlT25lKHsgX2lkIH0sIHsgaXNkZWxldGVkOiAxIH0pO1xyXG4gICAgICAgICAgICBhd2FpdCBWZWhpY2FsQ2F0ZWdvcmllTW9kZWwudXBkYXRlT25lKHsgX2lkIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBtZXNzYWdlOiBcImRlbGV0ZSBkYXRhXCIgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvciB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4qL1xyXG4gICAgc3RhdGljIGFzeW5jIGxpc3QocmVxLCByZXMpIHtcclxuICAgICAgICB0cnkge1xyXG5cdFx0XHRjb25zdCBzcnZSZXMgPSBhd2FpdCBTZXJ2aWNlLmxpc3RWZWhpY2xlQ2F0ZWdvcnkocmVxPy5xdWVyeSwgcmVxLnBhcmFtcylcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoc3J2UmVzLnN0YXR1c0NvZGUpLmpzb24oeyAuLi5zcnZSZXMgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cdFx0XHRyZXR1cm4gcmVzLnN0YXR1cyg0MDApLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBzYXZlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuXHRcdFx0Y29uc3Qgc3J2UmVzID0gYXdhaXQgU2VydmljZS5zYXZlVmVoaWNsZUNhdGVnb3J5KHJlcS5ib2R5KVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IC4uLnNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZShyZXEsIHJlcykge1xyXG4gICAgICAgIHRyeSB7XHJcblx0XHRcdGNvbnN0IHNydlJlcyA9IGF3YWl0IFNlcnZpY2UuZGVsZXRlVmVoaWNsZUNhdGVnb3J5KHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyhzcnZSZXMuc3RhdHVzQ29kZSkuanNvbih7IC4uLnNydlJlcyB9KTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcblx0XHRcdHJldHVybiByZXMuc3RhdHVzKDQwMCkuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG59Il19