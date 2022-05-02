import nodemailer from 'nodemailer';
import ejs from "ejs";
import mongoose from "mongoose";
import Config from '../utls/config';
// import Logger from '../utls/Logger';
import EmailTemplateModel from '../data-base/models/emailTemplate';
import EmailSentModel from '../data-base/models/emailSent';
import DriverModel from '../data-base/models/driver';
import CustomerModel from '../data-base/models/customer';
import {UserModel} from '../data-base/models/userModel';
import { clearSearch, mailer } from '../utls/_helper';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: Config.email.id,
        pass: Config.email.password
    }
});

export default class Service {

    /*
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
    */


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
                        subject: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                    {
                        key: { $regex: '.*' + (query?.key || '') + '.*' }
                    },
                ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        subject: 1,
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

            tplData.subject = data.subject;
            tplData.key = data.key;
            tplData.html = data.html;

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

    static async sendEmail(data) {
        const response = { statusCode: 400, message: 'Error!', status: false };
        let emailIds = [];
        try {
            if (data.emailTemplate !== 'custom') {
                const template = await EmailTemplateModel.findById(data.emailTemplate);
                data.subject = template.subject;
                data.html = template.html;
            }
            data.html = data.html.replace(/&lt;%=/g, "<%=");
            data.html = data.html.replace(/%&gt;/g, "%>");

            if (data.to === 'manyCustomers' || data.to === 'allCustomers') {
                emailIds = await this.sendMailToCustomers(data);
            }
            if (data.to === 'manyDrivers' || data.to === 'allDrivers') {
                emailIds = await this.sendMailToDrivers(data);
            }
            if (data.to === 'manyAdmins' || data.to === 'allAdmins') {
                emailIds = await this.sendMailToAdmins(data);
            }
            if (data.to === 'custom') {
                emailIds = await this.sendMailToEmailIds(data);
            }

            const tplData = new EmailSentModel();

            if(data.emailTemplate !== 'custom'){
                tplData.emailTemplate = data.emailTemplate;
            } else{
                tplData.emailContent.subject = data.subject;
                tplData.emailContent.html = data.html;
            }
            if(data.state){
                tplData.state = data.state;
            }
            if(data.district){
                tplData.district = data.district;
            }
            if(data.taluk){
                tplData.taluk = data.taluk;
            }
            if(data.serviceType){
                tplData.serviceType = data.serviceType;
            }

            tplData.to = data.to;
            tplData.emailIds = emailIds;

            await tplData.save();

            response.statusCode = 200;
            response.message = "Email sent";
            response.emailIds = emailIds;

            return response;
            
        } catch (e) {
            throw new Error("Error while sending email! Please check email template or composed mail");
        }
    }

    static async sendMailToCustomers(data) {
        if (data.to === 'allCustomers') {
            const search = {
                isDeleted: false,
                state: data.state ? mongoose.Types.ObjectId(data.state) : '',
                district: data.district ? mongoose.Types.ObjectId(data.district) : '',
                taluk: data.taluk ? mongoose.Types.ObjectId(data.taluk) : '',
            };

            clearSearch(search);
            const userDatas = await CustomerModel.find(search);
            data.emailIds = userDatas.map(v => v.email);
        }

        if (data.html.includes('<%=') && data.html.includes('%>')) {
            data.emailIds?.forEach(async (v) => {
                const userData = await CustomerModel.findOne({ email: v, isDeleted: false });

                const html = await ejs.render(data.html, { ...userData._doc, ...data?.emailData });
                await mailer(v, data.subject, html);
            });
        } else {
            await mailer(data.emailIds, data.subject, data.html);
        }

        return data.emailIds;
    }

    static async sendMailToDrivers(data) {
        if (data.to === 'allDrivers') {
            const search = {
                isDeleted: false,
                state: data.state ? mongoose.Types.ObjectId(data.state) : '',
                district: data.district ? mongoose.Types.ObjectId(data.district) : '',
                taluk: data.taluk ? mongoose.Types.ObjectId(data.taluk) : '',
                serviceType: data.serviceType ? mongoose.Types.ObjectId(data.serviceType) : '',
            };

            clearSearch(search);
            const userDatas = await DriverModel.find(search);
            data.emailIds = userDatas.map(v => v.email);
        }

        if (data.html.includes('<%= firstName %>') || data.html.includes('<%= lastName %>') || data.html.includes('<%= email %>')) {
            data.emailIds?.forEach(async (v) => {
                const userData = await DriverModel.findOne({ email: v, isDeleted: false });

                const html = await ejs.render(data.html, { ...userData._doc });
                await mailer(v, data.subject, html);
            });
        } else {
            await mailer(data.emailIds, data.subject, data.html);
        }

        return data.emailIds;
    }

    static async sendMailToAdmins(data) {
        if (data.to === 'allDrivers') {
            const search = {
                isDeleted: false,
                state: data.state ? mongoose.Types.ObjectId(data.state) : '',
                district: data.district ? mongoose.Types.ObjectId(data.district) : '',
                taluk: data.taluk ? mongoose.Types.ObjectId(data.taluk) : '',
            };

            clearSearch(search);
            const userDatas = await UserModel.find(search);
            data.emailIds = userDatas.map(v => v.email);
        }

        if (data.html.includes('<%= firstName %>') || data.html.includes('<%= lastName %>') || data.html.includes('<%= email %>')) {
            data.emailIds?.forEach(async (v) => {
                const userData = await UserModel.findOne({ email: v, isDeleted: false });

                const html = await ejs.render(data.html, { ...userData._doc });
                await mailer(v, data.subject, html);
            });
        } else {
            await mailer(data.emailIds, data.subject, data.html);
        }

        return data.emailIds;
    }

    static async sendMailToEmailIds(data) {
        await mailer(data.emailIds, data.subject, data.html);

        return data.emailIds;
    }

    static async listSentEmails(query, params) {
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
                // $or: [
                //     {
                //         subject: { $regex: '.*' + (query?.key || '') + '.*' }
                //     },
                //     {
                //         key: { $regex: '.*' + (query?.key || '') + '.*' }
                //     },
                // ],
            };

            clearSearch(search);

            const $aggregate = [
                { $match: search },
                { $sort: { _id: -1 } },
                {
                    "$project": {
                        emailTemplate: 1,
                        state: 1,
                        district: 1,
                        taluk: 1,
                        serviceType: 1,
                        to: 1,
                        emailIds: 1,
                        emailContent: 1,
                    }
                },
            ];

            const counter = await EmailSentModel.aggregate([...$aggregate, { $count: "total" }]);
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }
            response.result.total = counter[0]?.total;
            if (isAll) {
                response.result.page = 1;
                response.result.limit = response.result.total;
            }

            response.result.data = await EmailSentModel.aggregate(
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
}