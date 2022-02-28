import UserTypePermissionModel from "../data-base/models/userTypePermission";
export const validateSuperAdmin = async (req, res, next) => { validateCustomAdmin(req, res, next, 8); }
export const validateStateAdmin = async (req, res, next) => { validateCustomAdmin(req, res, next, 4); }
export const validateDistrictAdmin = async (req, res, next) => { validateCustomAdmin(req, res, next, 2); }
export const validateTehsilAdmin = async (req, res, next) => { validateCustomAdmin(req, res, next, 1); }
export const validateAnyOneAdmin = async (req, res, next) => { validateCustomAdmin(req, res, next, 15); }


export const validateCustomAdmin = async (req, res, next, num) => {

    /* 
     * For Super Admin          add 8
     * For State Admin          add 4
     * For District Admin       add 2
     * For Taluk Admin          add 1
     */

    num = ("0000" + ((num >>> 0).toString(2)));
    num = num.substring(num.length - 4);

    const totalPermissions = [
        num[0] * 1 ? 'superAdmin' : '',
        num[1] * 1 ? 'stateAdmin' : '',
        num[2] * 1 ? 'districtAdmin' : '',
        num[3] * 1 ? 'talukAdmin' : '',
    ];


    try {
        const cuser = req.__cuser;
        if (totalPermissions?.includes(cuser.type)) {
            next();
        } else {
            throw new Error("Unauthorized");
        }
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const checkAdminPermission = async (req, res, next, model, fillSDTValues = false, ...idKeys ) => {
    const response = { statusCode: 401, message: "Unauthorized", status: false };
    if (!idKeys.length) {
        idKeys = ['state', 'district', 'taluk']
    }

    try {
        const userType = req.__cuser.type;
        const userTypePermissions = await UserTypePermissionModel.find();

        userTypePermissions.map(async (utp) => {
            if (utp.typeKey === userType) {
                if (utp.grantedModules.includes('ALL') || utp.grantedModules.includes(model)) {
                    response.status = true;
                    response.statusCode = 200;

                    if(fillSDTValues){
                        const cuser = req.__cuser;
                        if(cuser.type === 'stateAdmin'){
                            req.body[idKeys[0]] = cuser.state.toString();
                        } else if(cuser.type === 'districtAdmin'){
                            req.body[idKeys[0]] = cuser.state;
                            req.body[idKeys[1]] = cuser.district;
                        } else if(cuser.type === 'talukAdmin'){
                            req.body[idKeys[0]] = cuser.state;
                            req.body[idKeys[1]] = cuser.district;
                            req.body[idKeys[2]] = cuser.taluk;
                        } else if(cuser.type === 'vehicleOwner'){
                            req.body[idKeys[0]] = cuser.state;
                            req.body[idKeys[1]] = cuser.district;
                            req.body[idKeys[2]] = cuser.taluk;
                        }

                    }
                }
            }
        })
    } catch (e) { } finally {
        if (response.status) {
            next();
        } else {
            res.status(response.statusCode).send(response);
        }
    }
}