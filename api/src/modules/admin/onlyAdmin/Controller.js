import Service from '../../../services/AdminService';

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
}