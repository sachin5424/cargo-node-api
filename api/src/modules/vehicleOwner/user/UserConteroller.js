import { UserModel, UserTokenModel } from "../../../data-base/index";
import { createData, createToken } from "../../../services/test";
import {validationResult} from "../../../settings/import";
import UserService from "../../../services/user.server";
import Service from "./_Service";
import jwtToken from "jsonwebtoken";
import randtoken from "rand-token";
import Config from "../../../utls/config";
// import * as dotenv from "dotenv";

// dotenv.config();
export default class UserController {

    static async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }
            
			const srvRes = await Service.ownerLogin(req.body)
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}