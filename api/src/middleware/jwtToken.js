import jwt from 'jsonwebtoken';
import { UserModel } from '../data-base';
import Logger from "../utls/Logger";
import Config from "./../utls/config";
import CustomerModel from '../data-base/models/customer';

export const jwtTokenPermission = async (req, res, next) => {
	try {
		var bearer = req.headers.authorization.split(" ");
		const token = bearer[1];
		var decode = jwt.verify(token, Config.jwt.secretKey);
		req.userId = decode.sub;

		try {
			const cuser = await UserModel.findById(decode.sub);
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
			throw new Error('User does not exist')
		}

		next();
	} catch (error) {
		res.status(401).json({
			status: 401,
			message: "Failed to authenticate. Try login again!"
		});
	}
};

export const authenticateCustomer = async (req, res, next) => {
	try {
		var bearer = req.headers.authorization.split(" ");
		const token = bearer[1];
		var decode = jwt.verify(token, Config.jwt.secretKey);
		req.userId = decode.sub;

		try {
			const cuser = await CustomerModel.findById(decode.sub);
			req.__cuser = cuser;
			global.cuser = cuser;
		} catch (e) {
			throw new Error('User does not exist')
		}

		next();
	} catch (error) {
		res.status(401).json({
			status: 401,
			message: "Failed to authenticate. Try login again!"
		});
	}
}