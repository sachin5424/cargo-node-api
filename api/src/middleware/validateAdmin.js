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
        // console.log('totalPermissions', totalPermissions);
        // console.log('cuser.type', cuser.type);
        if (totalPermissions?.includes(cuser.type)) {
            next();
        } else {
            throw new Error("Unauthorized");
        }
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};