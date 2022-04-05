import nodemailer from 'nodemailer';
import Config from '../utls/config';
import Logger from '../utls/Logger';
import EmailTemplateModel from '../data-base/models/emailTemplate';
import { clearSearch } from '../utls/_helper';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: Config.email.id,
        pass: Config.email.password
    }
});

export default class Service {

    static async sendEmail(to, subject, html) {

        const mailOptions = {
            from: Config.email.id,
            to: to,
            subject: subject,
            html: html
        };
    
        return new Promise((resolve, reject) => {
            return transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    Logger.error(
                        `
                            Error while sending mail
                            To   			- ${to}
                            Subject   		- ${subject}
                            Reason   	    - ${error.message}
                        `
                    );
                    reject(error);
                } else {
                    Logger.info(
                        `
                            An email was sent
                            To   			- ${to}
                            Subject   		- ${subject}
                            Response 	    - ${info.response}
                            Message Id 	    - ${info.messageId}
                            Info            - ${info}
                        `
                    );
                    resolve(info);
                }
            });
        })
    }

    static async listTemplates(query, params) {
        const isAll = params.isAll === 'ALL';
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            result: {
                data: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
                total: 0,
            },
            status: false
        };

        try {
            const search = {
                _id: query._id,
                $or: [
                    {
                        title: { $regex: '.*' + query?.key + '.*' }
                    },
                    {
                        key: { $regex: '.*' + query?.key + '.*' }
                    },
                ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        title: 1,
                        key: 1,
                        html: 1,
                        deletable: 1,
                    }
                },
            ];

            const counter = await EmailTemplateModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await EmailTemplateModel.aggregate(
                [
                    ...$aggregate,
                    { $limit: response.result.limit + response.result.limit * (response.result.page - 1) },
                    { $skip: response.result.limit * (response.result.page - 1) }
                ]);

            if (response.result.data.length) {
                response.message = "Data fetched";
            }
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e);
        }
    }
    static async saveTemplate(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await EmailTemplateModel.findById(_id) : new EmailTemplateModel();

            tplData.title = data.title;
            tplData.key = data.key;
            tplData.html = data.html;
            tplData.deletable = data.deletable;

            await tplData.save();

            response.message = _id ? "Email template is Updated" : "A new email template is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e);
        }
    }
    static async deleteTemplatePermanent(_id, cond) {
        cond = !cond ? {} : cond;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            await EmailTemplateModel.deleteOne({ _id, ...cond });

            response.message = "Deleted successfully";
            response.statusCode = 200;
            response.status = true;
            return response;

        } catch (e) {
            throw new Error("Can not delete. Something went wrong.");
        }
    }
    // static async deleteDriverPermanent(cond) {
    //     await EmailTemplateModel.deleteOne({ ...cond });
    // }

}