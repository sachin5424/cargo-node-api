import DriverModel from "../../../data-base/models/driver";
export function listDriver(req, res, next) {
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

export function saveDriver(req, res, next) {
    const response = {statusCode: 401, message: "Unauthorized", status: false};

    try{
        req.body.owner = req.__cuser._id.toString();
        response.status = true;
    } catch(e){} finally{
        if(!response.status){
            res.status(response.statusCode).send(response)
        } else{
            next();
        }
    }
}

export function deleteDriver(req, res, next) {
    const response = {statusCode: 401, message: "Unauthorized", status: false};

    try{
        if(!req.__cuser._id){
            throw new Error();
        }
        req.body._id = req.params.id;
        response.status = true;
    } catch(e){} finally{
        if(!response.status){
            res.status(response.statusCode).send(response)
        } else{
            next();
        }
    }
}

export async function validateDriverOwnership(req, res, next) {
    const response = {statusCode: 401, message: "Unauthorized", status: false};

    try{
        if(!req.__cuser._id){
            throw new Error();
        }
        if(req.body._id){
            const tpl = await DriverModel.findById(req.body._id);
            if(tpl.owner.toString() !== req.__cuser._id.toString()){
                throw new Error();
            }
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