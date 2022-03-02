import axios from "../utils/axios";

export default class onlyAdmin {
    static baseURL = 'adm';

    static listModules(data) {
        return axios.get(this.baseURL + '/list-modules', {params: data});
    }
    
    static listAdminModules(data) {
        return axios.get(this.baseURL + '/admin-modules', {params: data});
    }

    static saveAdminModules(data) {
        return axios.post(this.baseURL + '/save-admin-modules', data);
    }
}