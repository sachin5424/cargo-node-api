import Service from '../../../services/EmailService';

export default class EmailController {
    
    // static async list(req, res) {
    //     try {
	// 		const srvRes = await Service.listTemplates(req?.query, req.params);
    //         return res.status(srvRes.statusCode).json({ ...srvRes });
    //     } catch (e) {
	// 		return res.status(400).send({message: e.message});
	// 	}
    // }

    static async save(req, res) {
        try {
			const srvRes = await Service.sendEmail(req.body);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    // static async delete(req, res) {
    //     try {
	// 		const srvRes = await Service.deleteTemplatePermanent(req.params.id);
    //         return res.status(srvRes.statusCode).json({ ...srvRes });
    //     } catch (e) {
	// 		return res.status(400).send({message: e.message});
	// 	}
    // }

}