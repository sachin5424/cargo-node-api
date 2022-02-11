import { validationResult } from 'express-validator';
import Service from './_Service';

export default class CommonController {
    
    static async listStates(req, res) {
        try {
			const srvRes = await Service.listStates(req?.query)
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }
}