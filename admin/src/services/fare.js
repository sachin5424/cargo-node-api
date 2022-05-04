import axios from "../utils/axios";

export default class fare {
    static baseURL = 'fare-management/';

    static listPackage(data, module) {
        return axios.get(this.baseURL + 'package/list', { params: data, module });
    }
    static listPackageAll(data, module) {
        return axios.get(this.baseURL + 'package/list/ALL', { params: data, module });
    }
    static savePackage(data, module) {
        return axios.post(this.baseURL + "package/save", data, { module });
    }
    static deletePackage(id, module) {
        return axios.delete(`${this.baseURL}package/delete/${id}`, { module });
    }

    static list(data, module) {
        return axios.get(this.baseURL + 'list', { params: data, module });
    }
    static listAll(data, module) {
        return axios.get(this.baseURL + 'list/ALL', { params: data, module });
    }
    static save(data, module) {
        return axios.post(this.baseURL + "save", data, { module });
    }
    static delete(id, module) {
        return axios.delete(`${this.baseURL}delete/${id}`, { module });
    }

}