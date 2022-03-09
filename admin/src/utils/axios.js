import axios from "axios";
import util from "./util";
import rdx from "../rdx";

const axiosInstance = axios.create({
    baseURL: window.location.hostname !== 'localhost'
        ? 'https://demoaanaxagorasr.net/rupiloan/admin-api/public/api/admin/'
        : 'http://localhost:3003/admin/'
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers.authorization = 'Bearer ' + util.getToken();
        // if(rdx.isSupeadmin){
            if(!config.params){
                config.params = { serviceType: rdx.serviceType };
            } else{
                config.params.serviceType = rdx.serviceType ;
            }
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        let response = {};
        if (typeof error.response !== 'undefined') {
            response = error.response?.data;
            if (!response?.message) {
                response.message = error.message
            }
            if (response.errors && Array.isArray(response.errors)) {
                response.message = response.errors[0].msg;
            }
        } else {
            response.message = error.message
        }
        return Promise.reject(response);
    }
);

export default axiosInstance;