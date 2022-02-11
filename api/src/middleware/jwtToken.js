import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
import { UserModel } from '../data-base';
dotenv.config();
let jwtTokenPermission = async (req, res, next) => {
    // console.log(req.headers.authorization,"mm");
    try {
        var bearer = req.headers.authorization.split(" ");
        // console.log(req.headers.authorization);
        const token = bearer[1];
        var decode = jwt.verify(token, process.env.JWT_SECREATE_kEY);
        req.userId = decode.userId;

        try{
            const cuser = await UserModel.findById(decode.userId);
            req.__cuser = cuser;
        } catch(e){
            throw new Error('User does not exist')
        }

        next();
    }
    catch (error) {
        res.status(401).json({
            status: 401,
            message: "Failed to authenticate token."
        });
    }
};
export { jwtTokenPermission };
// module.exports  = (req:any,res:Response,next:NextFunction)=>{
//   try {
//        var bearer:any = req.headers.authentication.split(" ");
//        const token = bearer[1];
//        var decode = jwt.verify(token,process.env.JWT_SECREATE_kEY)
//         req.activeUser=decode
//       next()
//   } catch (error) {
//       res.status(401).json({
//           status:401,
//           message:"Failed to authenticate token."
//       }) 
//   }
// }
