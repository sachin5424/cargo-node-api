import Service from '../../../services/NotificationService';

export default class NotificationController {
    
    static async list(req, res) {
        try {
			const srvRes = await Service.listNotifications(req?.query, req.params);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async save(req, res) {
        try {
			const srvRes = await Service.saveNotification(req.body);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async delete(req, res) {
        try {
			const srvRes = await Service.deleteNotificationPermanent(req.params.id);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}