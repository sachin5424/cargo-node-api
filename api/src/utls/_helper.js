import { UserModel } from "../data-base/index";
import mime from "mime";
import fs from "fs";

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
    console.log(str);
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

export function getAdminFilter(cuser, ...keys) {
    let search = {};
    if (cuser.type === "superAdmin") {
        search = search;
    } else if (cuser.type === "stateAdmin") {
        search[keys[0] ? keys[0] : 'state'] = cuser.state;
    } else if (cuser.type === "districtAdmin") {
        search[keys[1] ? keys[1] : 'district'] = cuser.district;
    } else if (cuser.type === "talukAdmin") {
        search[keys[2] ? keys[2] : 'taluk'] = cuser.taluk;
    }
    return search;
}



export function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

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
    }
    catch (err) {
        throw new Error(err)
    }
}

export { matchPassword, slug };
