export const validateSuperAdmin = async (req, res, next) => {
    try {
        const cuser = req.__cuser;
        if (cuser.type === "superAdmin") {
            next();
        } else {
            throw new Error("Unauthorized");
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const validateStateAdmin = async (req, res, next) => {
    try {
        const cuser = req.__cuser;
        if (cuser.type === "stateAdmin") {
            next();
        } else {
            throw new Error("Unauthorized");
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const validateDistrictAdmin = async (req, res, next) => {
    try {
        const cuser = req.__cuser;
        if (cuser.type === "districtAdmin") {
            next();
        } else {
            throw new Error("Unauthorized");
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const validateTehsilAdmin = async (req, res, next) => {
    try {
        const cuser = req.__cuser;
        if (cuser.type === "tehsilAdmin") {
            next();
        } else {
            throw new Error("Unauthorized");
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};


export const validateAnyOneAdmin = async (req, res, next, num) => {

    /* 
     * For Super Admin add 8
     * For State Admin add 4
     * For District Admin add 2
     * For Taluk Admin add 1
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