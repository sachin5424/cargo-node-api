import { validationResult } from 'express-validator';
import Service from '../../../services/DriverService';
import { sendSignupMail } from '../../../thrirdParty/emailServices/driver/sendEmail';

export default class DriverController {
    
    static async list(req, res) {
        try {
			const srvRes = await Service.listDriver(req?.query, req.__cuser._doc)
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async save(req, res) {
        try {
			const srvRes = await Service.saveDriver(req.body)
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async delete(req, res) {
        try {
			const srvRes = await Service.deleteDriver(req.params.id);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}