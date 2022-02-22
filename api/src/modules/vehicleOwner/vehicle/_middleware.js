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