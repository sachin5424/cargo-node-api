import ejs from "ejs";
import path from 'path';
import EmailService from "../../../services/EmailService";
import Logger from "../../../utls/Logger";
import { encryptData } from "../../../utls/_helper";
import Config from "../../../utls/config";

export async function sendSignupMail(data) {
    try{
        const encEmail = encryptData(data.email);
        const url = Config.baseurls.emailVerification.vehicleOwner + "/" + encEmail;
        data = {...data, confirmURL: url};
        const html = await ejs.renderFile(path.join(__dirname, 'signup.html'), {...data});
        return EmailService.sendEmail(data.email, "Account Verification Mail", html);
    } catch(e){
        Logger.error(
            `
                Error while rendering email template
                Reason   	    - ${e.message}
            `
        );
        throw new Error(e);
    }
}

export async function sendResetPasswordMail(data) {
    try{
        const resetPasswordURL = Config.baseurls.resetPassword.vehicleOwner + "/" + data.key;
        data = {...data, resetPasswordURL: resetPasswordURL};
        const html = await ejs.renderFile(path.join(__dirname, 'resetPassword.html'), {...data});
        return EmailService.sendEmail(data.email, "Reset Your Password", html);
    } catch(e){
        Logger.error(
            `
                Error while rendering email template
                Reason   	    - ${e.message}
            `
        );
        throw new Error(e);
    }
}