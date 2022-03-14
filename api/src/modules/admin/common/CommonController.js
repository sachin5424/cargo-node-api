import { validationResult } from 'express-validator';
import Service from '../../../services/CommonService';
import initdata from "../../../data-base/connection/initdata";

export default class CommonController {
    
    static async listStates(req, res) {
        try {
			const srvRes = await Service.listStates(req?.query);
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async listServiceType(req, res) {
        try {
			const srvRes = await Service.listServiceType(req?.query);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async initdb(req, res) {
        try {
			await initdata()
            return res.status(200).json({ message: 'inserted' });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }
}