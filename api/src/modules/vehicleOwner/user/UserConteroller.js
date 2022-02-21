import { UserModel, UserTokenModel } from "../../../data-base/index";
import { createData, createToken } from "../../../services/test";
import {validationResult} from "../../../settings/import";
import UserService from "../../../services/user.server";
import Service from "./_Service";
import jwtToken from "jsonwebtoken";
import randtoken from "rand-token";
import * as dotenv from "dotenv";

dotenv.config();
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

    static async refreshToken(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(401).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }
            else {
                const { email, refreshToken } = req.body;
                const data = await UserTokenModel.findOne({ email: email, refreshToken: refreshToken });
                if (data) {
                    var user = {
                        'email': email,
                    };
                    var token = jwtToken.sign(user, process.env.JWT_SECREATE_kEY, { expiresIn: process.env.JWT_TIME });
                    return res.status(200).json({
                        token: token
                    });
                }
                return res.send(400).json({ error: "Invalid refreshToken" });
            }
        }
        catch (error) {
            return res.send(500).json({ error });
        }
    }

    static async tokenDelete(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }
            else {
                const { email, refreshToken } = req.body;
                await UserTokenModel.findOneAndDelete({ email: email, refreshToken: refreshToken }).catch((err) => {
                    return res.send(400).json({ error: "Invalid refreshToken" });
                });
                return res.send(200).json({ error: "delete refreshToken" });
            }
        }
        catch (error) {
            return res.status(500).json({ error });
        }
    }

}