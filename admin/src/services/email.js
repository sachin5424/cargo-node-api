import axios from "../utils/axios";

export default class email {

    static baseURL = 'email';

    static listTeplates(data, module) {
        return axios.get(this.baseURL + '/template/list', { params: data, module });
    }
    static listAllTeplates(module) {
        return axios.get(this.baseURL + "/template/list/ALL", { module });
    }
    static saveTeplate(data, module) {
        return axios.post(this.baseURL + "/template/save", data, { module });
    }
    static deleteTeplates(id, module) {
        return axios.delete(`${this.baseURL}/template/delete/${id}`, { module });
    }

    static list(data, module) {
        return axios.get(this.baseURL + '/list', { params: data, module });
    }
    static listAll(module) {
        return axios.get(this.baseURL + "/list/ALL", { module });
    }
    static save(data, module) {
        return axios.post(this.baseURL + "/save", data, { module });
    }
    static delete(id, module) {
        return axios.delete(`${this.baseURL}/delete/${id}`, { module });
    }

}