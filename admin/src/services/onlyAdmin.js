import axios from "../utils/axios";

export default class onlyAdmin {
    static baseURL = 'adm';

    static listModules() {
        return axios.get(this.baseURL + '/list-modules');
    }
    
    static listAdminModules() {
        return axios.get(this.baseURL + '/admin-modules');
    }

    static saveAdminModules(data) {
        return axios.post(this.baseURL + '/save-admin-modules', data);
    }
}