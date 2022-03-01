import Service from '../../../services/SDTService';

export default class SDT {
    
    static async sdtList(req, res) {
        try {
			const srvRes = await Service.sdtList(req?.query, req.__cuser._doc)
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}