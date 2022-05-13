import { validationResult } from 'express-validator';
import Service from '../../../services/OnlyAdminService';

export default class CustomerController {
    
    static async listModules(req, res) {
        try {
			const srvRes = await Service.listModules(req?.query, req.params);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async saveModule(req, res) {
        try {
			const srvRes = await Service.saveModule(req?.body);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async deleteModule(req, res) {
        try {
			const srvRes = await Service.deleteModule(req.params._id);
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

    static async listAllModules(req, res) {

        try {
			const srvRes = await Service.listAllModules(req);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async listUserModules(req, res) {

        try {
			const srvRes = await Service.listUserModules(req);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async saveUserModules(req, res) {
        try {
			const srvRes = await Service.saveUserModules(req.body);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }
}