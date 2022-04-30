import ejs from "ejs";
import path from "path";

export async function renderCustomerResetPasswordForm(data){
    return await ejs.renderFile(path.join(__dirname, 'customer.txt'), {...data});
}

export async function renderDriverResetPasswordForm(data){
    return await ejs.renderFile(path.join(__dirname, 'driver.txt'), {...data});
}

export async function renderVehicleOwnerResetPasswordForm(data){
    return await ejs.renderFile(path.join(__dirname, 'vehicleOwner.txt'), {...data});
}