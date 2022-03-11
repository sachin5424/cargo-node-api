import jwt from 'jsonwebtoken';
import { UserModel } from '../data-base';
import Logger from "../utls/Logger";
import VehicleOwnerModel from "../data-base/models/vehicleOwner";
import Config from "./../utls/config";

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

			if(cuser.type==='stateAdmin'){
				global.state = cuser.state;
			} else if(cuser.type==='districtAdmin'){
				global.state = cuser.state;
				global.district = cuser.district;
			} else if(cuser.type==='talukAdmin'){
				global.state = cuser.state;
				global.district = cuser.district;
				global.taluk = cuser.taluk;
			}
		} catch (e) {
			throw new Error('User does not exist')
		}

		next();
	}
	catch (error) {
		res.status(401).json({
			status: 401,
			message: "Failed to authenticate. Try login again!"
		});
	}
};

export const vehicleOwnerValidate = async (req, res, next) => {
	const response = { statusCode: 401, message: 'Authorization error', status: false };
	try {
		if (req.headers.authorization) {
			const authorization = req.headers.authorization.trim();
			if (authorization.startsWith('Bearer ')) {
				const jwtToken = authorization.substring(7);
				if (jwtToken) {
					Logger.info('AuthMiddleware of Vehicle Owner: Validating auth token');
					const authUserId = jwt.verify(jwtToken, Config.jwt.secretKey);
					try {
						const authUser = await VehicleOwnerModel.findById(authUserId.sub);
						// cUser = authUser;
						if (!authUser) {
							response.message = "Token is expired";
						} else {
							req.__cuser = {...authUser._doc, type: 'vehicleOwner'};
							response.status = true;
							response.message = "Token validated";
						}
					} catch (e) {
						response.message = "Authorization failed"
					}

				} else {
					Logger.error('AuthMiddleware : Empty token');
					response.message = "Access token not found";
				}
			} else {
				Logger.error('Invalid authorization value');
				response.message = "Invalid access token.";
			}
		} else {
			Logger.error("Access token not found");
			response.message = "Access token not found";
		}
		if (response.status) {
			next();
		} else {
			throw new Error(response.message)
		}
	} catch (e) {
		Logger.error('AuthMiddleware for vehicle owner  Failed : ');
		res.status(401).send(response)
	}
}
