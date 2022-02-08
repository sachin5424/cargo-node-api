import { UserModel } from "../data-base/index";
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
export { matchPassword, slug };
