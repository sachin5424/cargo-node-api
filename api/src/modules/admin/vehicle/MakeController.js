import Service from '../../../services/VehicleService';

export default class MakeController {
    
    static async list(req, res) {
        try {
			const srvRes = await Service.listMake(req?.query, req.params)
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async save(req, res) {
        try {
			const srvRes = await Service.saveMake(req.body)
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async delete(req, res) {
        try {
			const srvRes = await Service.deleteMake(req.params.id);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}