import customerModel from '../../../data-base/models/customer';
import jwtToken from 'jsonwebtoken'


const userRegister = async (req, res) => {
    try {
        const payload = req.body;
        var otp = Math.floor(100000 + Math.random() * 900000);
        otp = 1234;//String(otp);
        // otp = otp.substring(0,4);
        // console.log( "valor:" +a );
        let options = {
            firstName: payload.firstName,
            phoneNo: payload.phoneNo,
            email: payload.email,
            password: payload.password,
            emailOtp: parseInt(otp),
        };
        let newData = new customerModel(options);
        let data = await newData.save();
        return res.status(200).json(
            {
                status: 200,
                message: 'success ',
                data: {
                    username: data.firstName + ' ' + data.lastName,
                    phoneNo: data.phoneNo,
                    email: data.email,
                }
            }
        )
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message
        })
    }
}

const userOtpVerification = async (req, res) => {
    try {
        const payload = req.body;
        let options = {
            phoneNo: payload.phoneNo,
            otp: payload.otp,
        }
        const user = await customerModel.findOne(options);
        let userDetails = {}
        if (user) {
            userDetails['userId'] = user._id;
            userDetails['email'] = user.email || user.phoneNo;
            const token = jwtToken.sign(userDetails, 'testing', {
                expiresIn: '86765m'
            });
            return res.status(200).json({
                status: 200,
                message: "user login successfully",
                accessToken: token,
            })
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message })
    }
}


const userLoginWithMobile = async (req, res) => {
    try {
        const payload = req.body;
        let option = {
            phoneNo: payload.phoneNo,
        }
        const user = await customerModel.findOne(option);
        let userDetails = {}
        if(user){
            userDetails['userId'] = user._id;
            userDetails['email'] = user.email || user.phoneNo;
            const token = jwtToken.sign(userDetails, 'testing', {
                expiresIn: '86765m'
            });
            return res.status(200).json({
                status: 200,
                message: "user login successfully",
                accessToken: token,
            })
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message})
    }
}


const  userForgetPassword = async (req, res) => {
    try {
        const payload = req.body;
        let options = {
            phoneNo: payload.phoneNo,
           
        }
        const user = await customerModel.findOneAndUpdate(options,{emailOtp:"1234"});
       return res.status(200).json({status: 200, message: "otp sent",data:user})
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message})
    }
}



export {
    userRegister, userOtpVerification,userLoginWithMobile,userForgetPassword
}