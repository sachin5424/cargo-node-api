import {validationResult} from "../../../settings/import";
import Service from "../../../services/CustomerService";
import { decryptData } from "../../../utls/_helper";
import { renderCustomerResetPasswordForm } from "../../../views/resetPassword/renderFile";
import config from "../../../utls/config";

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
            
			const srvRes = await Service.customerLogin(req.body)
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
			const srvRes = await Service.verifyEmail(email);
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async genForgetPasswordUrl(req, res) {
        try {
            const email = req.body.email;

			const srvRes = await Service.genForgetPasswordUrl(email);
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async resetPasswordForm(req, res) {
        try {
            const originalUrl = req.originalUrl;
            const callbackUrl = config.applicationBaseUrl;
            const callbackUrlText = 'Login Here';

            const html = await renderCustomerResetPasswordForm({originalUrl, callbackUrl, callbackUrlText});
            res.setHeader('Content-Type', 'text/html').send(html)
        } catch (e) {
			return res.status(400).send({message: 'Error try again!'});
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