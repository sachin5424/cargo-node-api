import axios from "../utils/axios";

export default class onlyAdmin {
    static baseURL = 'adm';

    static listModules(data, module) {
        return axios.get(this.baseURL + '/list-modules', { params: data, module });
    }
    static listModulesAll(data, module) {
        return axios.get(this.baseURL + '/list-modules/ALL', { params: data, module });
    }
    static saveModule(data, module) {
        return axios.post(this.baseURL + "/save-module", data, { module });
    }
    static deleteModule(id, module) {
        return axios.delete(`${this.baseURL}/delete-module/${id}`, { module });
    }

    static listAdminModules(data, module) {
        return axios.get(this.baseURL + '/admin-modules', { params: data, module });
    }

    static saveAdminModules(data, module) {
        return axios.post(this.baseURL + '/save-admin-modules', data, { module });
    }
}