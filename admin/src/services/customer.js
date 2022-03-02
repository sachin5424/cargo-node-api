import axios from "../utils/axios";

export default class customer {

    static baseURL = 'customer';

    static list(data) {
        return axios.get(this.baseURL + '/list', { params: data });
    }
    static listAll() {
        return axios.get(this.baseURL + "/list/all");
    }
    static listAllIgnoreStatus(module) {
        return axios.get(this.baseURL + "/all/ignore-status", { module });
    }
    static save(data, module) {
        return axios.post(this.baseURL + "/save", data, { module });
    }
    static delete(id, module) {
        return axios.delete(`${this.baseURL}/delete/${id}`, { module });
    }

}