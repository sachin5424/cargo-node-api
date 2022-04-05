import axios from "../utils/axios";

export default class email {

    static baseURL = 'email';

    static listTeplates(data, module) {
        return axios.get(this.baseURL + '/template/list', { params: data, module });
    }
    static listAllTeplates(module) {
        return axios.get(this.baseURL + "/template/list/all", { module });
    }
    static saveTeplate(data, module) {
        return axios.post(this.baseURL + "/template/save", data, { module });
    }
    static deleteTeplates(id, module) {
        return axios.delete(`${this.baseURL}/template/delete/${id}`, { module });
    }

}