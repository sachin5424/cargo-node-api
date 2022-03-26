import Service from '../../../services/DriverService';

export default class WalletController {
    
    static async list(req, res) {
        try {
			const srvRes = await Service.listWalletHistory(req?.query, req.__cuser._doc)
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async save(req, res) {
        try {
            const data = await Service.walletDataLogicAdmin(req.body);
			const srvRes = await Service.saveWalletHistory(data)
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}