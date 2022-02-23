import nodemailer from 'nodemailer';
import Config from '../utls/config';
import Logger from '../utls/Logger';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: Config.email.id,
        pass: Config.email.password
    }
});

export default async function EmailService(to, subject, html) {

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