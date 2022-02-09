import { express, } from '../../settings/import';
import { validationResult } from 'express-validator';
import { MongooseService } from '../../services/permission-service';
import { UserAuthPermission, UserAuthModelPermission, UserModel } from '../../data-base/index';
// import { jwtTokenPermission } from '../../middleware/jwtToken';
import { aggregateFilter } from '../../services/test';
// import { addPermission } from '../../validation/model-permission';
import mongoose from 'mongoose';
export default class PermissionController extends MongooseService {
    constructor() {
        super();
        this.router = express.Router();
        this.path = '/permission';
        this.permission = UserAuthPermission;
        this.userModelPermission = UserAuthModelPermission;
        // this.intializeRoutes();
    }
    /*
     All Intialize Routes
    */
    intializeRoutes() {
        // this.router.get('/test', jwtTokenPermission, this.get);
        // this.router.get(this.path, this.getPermission);
        // this.router.post(this.path, addPermission, this.addPermission);
        // this.router.post(this.path + '-multi', this.addMultiPermission);
        // this.router.post(this.path,this.validations.addMultiPermission,this.addMultiPermission)
    }
    static async get(req, res) {
        try {
            const getReq = req;
            const { model } = req.query;
            const temp = [];
            const check_admin = await UserModel.findOne({ _id: getReq.userId, isAdmin: true });
            if (check_admin) {
                const admin_permission = ["GET", "DELETE", "PUT", "POST"];
                return res.status(200).json({ temp: [...temp, ...admin_permission] });
            }
            let test = [
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(getReq.userId)
                    }
                },
                {
                    $lookup: {
                        from: "user_auth_permissions",
                        localField: "permissionId",
                        foreignField: "_id",
                        as: "permission"
                    }
                },
                { $match: {
                        "permission.model_name": model
                    } },
                {
                    $project: {
                        "permission.method": 1
                    }
                }
            ];
            const data = await aggregateFilter(UserAuthModelPermission, test);
            //   console.log(getReq.userId);
            for (var i = 0; i < data.length; i++) {
                temp.push(data[i].permission[0].method);
            }
            res.status(200).json({ data, temp });
        }
        catch (error) {
            return res.status(500).json({ error });
        }
    }
    static async getPermission(req, res) {
        try {
            const data = await UserAuthModelPermission.find();
            return res.status(200).json({ data });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
    static async addPermission(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }
            else {
                let payload = req.body;
                const newData = new UserAuthModelPermission(payload);
                await newData.save();
                // await this.add(this.userModelPermission,payload);
                return res.status(200).json({ message: "add permission" });
            }
        }
        catch (error) {
            return res.status(500).json({ error: error });
        }
    }
    static async addMultiPermission(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }
            else {
                let payload = req.body;
                let permissionList = req.body.permissionList;
                for (var i = 0; i < permissionList.length; i++) {
                    const check_data = await this.userModelPermission.findOne({ userId: permissionList[i].userId, permissionId: permissionList[i].permissionId });
                    if (check_data) {
                        return res.status(400).json({ error: "err" });
                    }
                }
                await this.userModelPermission.insertMany(payload.permissionList);
                return res.status(200).json({ message: "add permission", payload });
            }
        }
        catch (error) {
            return res.status(500).json({ error: error });
        }
    }
}
