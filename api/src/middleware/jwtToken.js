import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
import { UserModel } from '../data-base';
import Logger from "../utls/Logger";
// import VehicleOwnerModel from "../data-base/models/vehicleOwner";

dotenv.config();
export const jwtTokenPermission = async (req, res, next) => {
    try {
        var bearer = req.headers.authorization.split(" ");
        const token = bearer[1];
        var decode = jwt.verify(token, process.env.JWT_SECREATE_kEY);
        req.userId = decode.userId;

        try{
            const cuser = await UserModel.findById(decode.userId);
            req.__cuser = cuser;
        } catch(e){
            throw new Error('User does not exist')
        }

        next();
    }
    catch (error) {
        res.status(401).json({
            status: 401,
            message: "Failed to authenticate token."
        });
    }
};

export const vehicleOwnerValidate = async (req, res, next) => {
//     try {
		// if (req.headers.authorization) {
		// 	const authorization = req.headers.authorization.trim();
		// 	if (authorization.startsWith('Bearer ')) {
		// 		const jwtToken = authorization.substring(7);
		// 		if (jwtToken) {
		// 			Logger.info('AuthMiddleware of Vehicle Owner: Validating auth token');
		// 			const authUserId = jwt.verify(jwtToken, Config.JWT_SECRET_KEY)
					
		// 			const authUser = await VehicleOwnerModel.findById(authUserId.sub);
		// 			cUser = authUser;
		// 			if(!authUser) {
		// 				throw new Error("Token is expired");
		// 			}
		// 			req.authUser = authUser;
		// 		} else {
		// 			Logger.error('AuthMiddleware : Empty token');
		// 			throw new Error("Access token not found");
		// 		}
		// 	} else {
		// 		Logger.error('Invalid authorization value');
		// 		throw Error("Invalid access token.");
		// 	}
		// } else {
		// 	Logger.error(Message.tokenMissing);
		// 	throw new Error("Access token not found");
		// }
		next();
	// } catch (e) {
		// Logger.error('AuthMiddleware Failed : ');

		// throw new Error("Authorization failed");
	// }
}
