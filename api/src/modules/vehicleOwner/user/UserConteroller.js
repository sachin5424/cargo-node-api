import {validationResult} from "../../../settings/import";
import Service from "../../../services/VehicleService";
import { decryptData } from "../../../utls/_helper";

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

    static async verifyEmail(req, res) {
        try {
            let email = '';
            try{
                email = decryptData(req.params.email);
            } catch(e){
                throw new Error('Invalid path')
            }
			const srvRes = await Service.ownerVerifyEmail(email);
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async genForgetPasswordUrl(req, res) {
        try {
            const email = req.params.email;

			const srvRes = await Service.ownerGenForgetPasswordUrl(email);
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async resetPAssword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }

            const key = req.params.key;
			const srvRes = await Service.ownerResetPAssword(key, req.body);
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}