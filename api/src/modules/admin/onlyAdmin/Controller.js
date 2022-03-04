import { validationResult } from 'express-validator';
import Service from '../../../services/OnlyAdminService';

export default class CustomerController {
    
    static async listModules(req, res) {
        try {
			const srvRes = await Service.listModules(req?.query, req.params)
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }
    
    static async adminModules(req, res) {
        try {
			const srvRes = await Service.adminModules(req?.query, req.params)
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async saveAdminModules(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }

			const srvRes = await Service.saveAdminModules(req.body);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }
}