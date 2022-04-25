import axios from "../utils/axios";

export default class notification {
    static baseURL = 'notification/';

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