import axios from "axios";
import util from "./util";

const allModules = util.getModules();
const isSuperAdmin = util.isSuperAdmin();

const axiosInstance = axios.create({
    baseURL: window.location.hostname !== 'localhost'
        ? 'http://52.66.147.53:3003/admin/'
        : 'http://52.66.147.53:3003/admin/'
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (isSuperAdmin || config.module === 'ignoreModule' || allModules.includes(config.module)) {
            config.headers.authorization = 'Bearer ' + util.getToken();
            return config;
        } else {
            return Promise.reject(new Error('Unauthorized'));
        }
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