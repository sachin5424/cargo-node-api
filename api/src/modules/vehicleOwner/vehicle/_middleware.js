export function listVehicle(req, res, next) {
    const response = {statusCode: 401, message: "Unauthorized", status: false};

    try{
        req.query.owner = req.__cuser._id;
        response.status = true;
    } catch(e){} finally{
        if(!response.status){
            res.status(response.statusCode).send(response)
        } else{
            next();
        }
    }
}

export function saveVehicle(req, res, next) {
    const response = {statusCode: 401, message: "Unauthorized", status: false};

    try{
        req.body.owner = req.__cuser._id;
        response.status = true;
    } catch(e){} finally{
        if(!response.status){
            res.status(response.statusCode).send(response)
        } else{
            next();
        }
    }
}

export function deleteVehicle(req, res, next) {
    const response = {statusCode: 401, message: "Unauthorized", status: false};

    try{
        if(!req.__cuser._id){
            throw new Error();
        }
        response.status = true;
    } catch(e){} finally{
        if(!response.status){
            res.status(response.statusCode).send(response)
        } else{
            next();
        }
    }
}