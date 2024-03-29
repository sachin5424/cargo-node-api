import crypto from "crypto";
import sendGridMail from '@sendgrid/mail';
import Logger from "./Logger";
import { UserModel } from "../data-base/index";
import mime from "mime";
import fs from "fs";
import Config from "./config";

sendGridMail.setApiKey(Config.sendGrid.apiKey);

let matchPassword = (email, password) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: email, }, function (err, user) {
            if (err) {
                reject(err);
            }
            else {
                if (!user) {
                    reject(err);
                }
                else {
                    user.comparePassword(password, function (err, isMatch) {
                        if (err) {
                            reject(err);
                        }
                        resolve(isMatch);
                    });
                }
            }
        });
    });
};
var slug = function (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
    return str;
};

export function clearSearch(obj) {
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object") {
            clearSearch(value)
        } else {
            if (typeof value === 'undefined' || (typeof value === 'string' && value.length < 1)) {
                delete (obj[key])
            }
        }
    }
}

export function getAdminFilter(...keys) {
    let search = {};
    search[keys[0] ? keys[0] : 'state'] = global.state;
    search[keys[1] ? keys[1] : 'district'] = global.district;
    search[keys[2] ? keys[2] : 'taluk'] = global.taluk;
    clearSearch(search);
    return search;
}

export function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');

    return response;
}

export async function uploadFile(dataBase64, path, model, key, _id) {
    if (!dataBase64) {
        try {
            const f = await model.findById(_id);
            return f[key] || '';
        } catch (e) {
            return '';
        }

    }
    var decodedImg = decodeBase64Image(dataBase64);
    var imageBuffer = decodedImg.data;
    var type = decodedImg.type;
    var extension = mime.getExtension(type);
    var fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + extension;
    try {
        await fs.writeFileSync(path + fileName, imageBuffer, 'utf8');
        try {
            if (_id) {
                const f = await model.findById(_id);
                fs.unlink(path + f[key], () => { });
            }
        } catch (e) {
            // new Error
        }
        return fileName
    } catch (err) {
        throw new Error(err)
    }
}

export async function uploadMultipleFile(dataBase64Array, path, model, key, _id, deletingFiles) {
    const fileNames = await deleteMultipleFiles(path, model, key, _id, deletingFiles);
    if (Array.isArray(dataBase64Array) && dataBase64Array.length > 0) {
        const prms = dataBase64Array.map(async (v) => {
            return uploadFile(v, path, model);
        });

        if (prms.length > 0) {
            return Promise.all(prms).then(res => {
                res.forEach(v => {
                    fileNames.push(v);
                })
                return fileNames;
            });
        }
    } else {
        return fileNames;
    }
}

export async function deleteMultipleFiles(path, model, key, _id, deletingFiles) {
    let tpl, fileNames = [];

    if(_id){
        tpl = await model.findById(_id);
        fileNames = tpl[key]?.filter(v => !deletingFiles?.includes(v));
    }

    if (_id && Array.isArray(deletingFiles) && deletingFiles.length > 0) {
        try {
            deletingFiles.map(v => {
                fs.unlink(path + v, () => { });
            });

        } catch (err) {

        }
    }
    return fileNames;
}

export function encryptData(text) {
    let iv = crypto.randomBytes(Config.crypto.ivLength);
    let cipher = crypto.createCipheriv(Config.crypto.algorithm, Buffer.from(Config.crypto.encryptionKey, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptData(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(Config.crypto.algorithm, Buffer.from(Config.crypto.encryptionKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export async function mailer(to, subject, html) {

    const mailOptions = {
        to,
        from: Config.sendGrid.senderEmail,
        subject,
        html,
    };


    return new Promise(async (resolve, reject) => {
        try {
            const info = await sendGridMail.send(mailOptions);
            resolve(info);
        } catch (error) {
            Logger.error(
                `
                    Error while sending mail
                    To   			- ${to}
                    Subject   		- ${subject}
                    Reason   	    - ${error.message}
                `
            );
            reject(error);
        }
    })
} 




export { matchPassword, slug };
