export const validateSuperAdmin = async (req, res, next) => {
    try {
        const cuser = req.__cuser;
        if(cuser.type === "superAdmin"){
            next();
        } else{
            throw new Error("Unauthorized");
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const validateStateAdmin = async (req, res, next) => {
    try {
        const cuser = req.__cuser;
        if(cuser.type === "stateAdmin"){
            next();
        } else{
            throw new Error("Unauthorized");
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const validateDistrictAdmin = async (req, res, next) => {
    try {
        const cuser = req.__cuser;
        if(cuser.type === "districtAdmin"){
            next();
        } else{
            throw new Error("Unauthorized");
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const validateTehsilAdmin = async (req, res, next) => {
    try {
        const cuser = req.__cuser;
        if(cuser.type === "tehsilAdmin"){
            next();
        } else{
            throw new Error("Unauthorized");
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};