import { validationResult } from 'express-validator';
import Service from '../../../services/VehicleService';

export default class VehicleController {
    
    static async list(req, res) {
        try {
            const query = {...req?.query, owner: req.__cuser._id}
			const srvRes = await Service.listVehicle(query);

            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async save(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }
            const body = {...req.body, owner: req.__cuser._id};
			const srvRes = await Service.saveVehicle(body);

            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async delete(req, res) {
        try {
			const srvRes = await Service.deleteVehicle(req.params.id, {owner: req.__cuser._id});
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}