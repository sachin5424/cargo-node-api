import { userRegisterValidation, userLoginValidation, userRefreshTokenValidation, check_params } from "../validation/user.validation";
import { UserModel, UserTokenModel } from "../data-base/index";
import { createData, createToken } from "../services/test";
import {validationResult} from "../settings/import";
import UserService from "../services/user.server";
import jwtToken from "jsonwebtoken";
import randtoken from "rand-token";
import * as dotenv from "dotenv";
import express from "express";

dotenv.config();
export class UserController extends UserService {
    // private userData:UserListInterface[];
    constructor() {
        super();
        this.router = express.Router();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post('/resgister', userRegisterValidation, this.userRegister);
        this.router.get('/user-list', this.userList);
        this.router.get('/user-profile/:id', check_params, this.userProfile);
        this.router.post('/login', userLoginValidation, this.userLogin);
        this.router.post('/refresh-token', userRefreshTokenValidation, this.userRefreshToken);
        this.router.post('/delete-refresh-token', userRefreshTokenValidation, this.userTokenDelete);
    }
    async userList(req, res) {
        try {
            console.log(req);
            const userData = await UserModel.find().select('-password');
            console.log(userData);
            return res.status(200).json({ data: userData });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
    async userProfile(req, res) {
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
                const data = await UserModel.findOne({ _id });
                return res.status(200).json({ data });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
    async userRegister(req, res) {
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
                await createData(UserModel, payload);
                return res.status(200).json({ data: "register" });
            }
        }
        catch (error) {
            return res.status(500).json({ error });
        }
    }
    async userLogin(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }
            else {
                const { email, password } = req.body;
                if (email) {
                    const user = await UserModel.findOne({ email: email });
                    const userDetails = {
                        userId: user._id,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        isStaf: user.isStaf
                    };
                    var token = jwtToken.sign(userDetails, 'test', { expiresIn: process.env.JWT_TIME });
                    var refreshToken = randtoken.uid(256);
                    const check_token = await UserTokenModel.findOne({ email: email });
                    if (check_token) {
                        await UserTokenModel.findOneAndUpdate({ email: email }, { refreshToken });
                    }
                    else {
                        await createToken(UserTokenModel, { email: email, refreshToken });
                    }
                    return res.status(200).json({
                        accessToken: token,
                        refreshToken: refreshToken
                    });
                }
                // const data = await createData(UserModel, payload)
                return res.status(400).json({ message: "try agin" });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
    async userRefreshToken(req, res) {
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
    async userTokenDelete(req, res) {
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