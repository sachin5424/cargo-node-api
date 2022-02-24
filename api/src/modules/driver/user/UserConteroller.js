import { validationResult } from "express-validator";
import Service from "../../../services/DriverService";
import { decryptData } from "../../../utls/_helper";

export default class UserController {

    static async verifyEmail(req, res) {
        try {
            let email = '';
            try{
                email = decryptData(req.params.email);
            } catch(e){
                throw new Error('Invalid path')
            }
			const srvRes = await Service.verifyEmail(email);
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async genForgetPasswordUrl(req, res) {
        try {
            const email = req.params.email;

			const srvRes = await Service.genForgetPasswordUrl(email);
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

			const srvRes = await Service.resetPAssword(key, req.body);
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}