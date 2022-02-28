import axios from "../utils/axios";

export default class bank {

    static baseURL = 'customer';

    static list(data, module) {
        return axios.get(this.baseURL + '/list', { params: data, module });
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