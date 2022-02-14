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

    num = ("0000" + ((3 >>> 0).toString(2)));
    num = num.substring(num.length - 4);

    const isSuperAdmin = 8;//num[0] * 1;
    const isStateAdmin = 4;//num[1] * 1;
    const isDistrictAdmin = 2;//num[2] * 1;
    const isTalukAdmin = 1;//num[3] * 1;

    try {
        const cuser = req.__cuser;
        if (admins?.includes(cuser.type)) {
            next();
        } else {
            throw new Error("Unauthorized");
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};