import axios from "../utils/axios";

export default class onlyAdmin {
    static baseURL = 'adm';

    static listModules(data, module) {
        return axios.get(this.baseURL + '/list-modules', { params: data, module });
    }

    static listAdminModules(data, module) {
        return axios.get(this.baseURL + '/admin-modules', { params: data, module });
    }

    static saveAdminModules(data, module) {
        return axios.post(this.baseURL + '/save-admin-modules', data, { module });
    }
}