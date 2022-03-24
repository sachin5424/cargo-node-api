import { validationResult } from 'express-validator';
import Service from '../../../services/DriverService';
import { sendSignupMail } from '../../../thrirdParty/emailServices/driver/sendEmail';

export default class DriverController {
    
    static async list(req, res) {
        try {
			const srvRes = await Service.listDriver(req?.query, req.__cuser._doc)
            return res.status(srvRes.statusCode).json({ ...srvRes });
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
            
			const srvRes = await Service.saveDriver(req.body)

            if(!req.body._id){
                try{
                    await sendSignupMail(req.body);
                    srvRes.message = "A confirmation email is sent to the email. Please verify!"
                } catch(e){
                    Service.deleteDriverPermanent({email: req.body.email});
                    throw new Error("Error while sending confirmation email. Please try again!");
                }
            }
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async delete(req, res) {
        try {
			const srvRes = await Service.deleteDriver(req.params.id);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}