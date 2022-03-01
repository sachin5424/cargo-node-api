import { validationResult } from 'express-validator';
import Service from '../../../services/CustomerService';
import { sendSignupMail } from '../../../thrirdParty/emailServices/customer/sendEmail';

export default class CustomerController {
    
    static async list(req, res) {
        try {
			const srvRes = await Service.listCustomer(req?.query, req.params)
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
            
			const srvRes = await Service.saveCustomer(req.body)

            if(!req.body._id){
                try{
                    await sendSignupMail(req.body);
                    srvRes.message = "A confirmation email is sent to the email. Please verify!"
                } catch(e){
                    Service.deleteCustomerPermanent({email: req.body.email});
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
			const srvRes = await Service.deleteCustomer(req.params.id, {state: global.state, district: global.district, taluk: global.taluk});
            return res.status(srvRes.statusCode).json({ srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}