import axios from "../utils/axios";

export default class vehicle {
    static baseURL = 'vehicle/';

    static listCategory(data, module) {
        return axios.get(this.baseURL + 'category/list', { params: data, module });
    }
    static listAllCategory(data, module) {
        return axios.get(this.baseURL + 'category/list/ALL', { params: data, module });
    }
    static saveCategory(data, module) {
        return axios.post(this.baseURL + "category/save", data, { module });
    }
    static deleteCategory(id, module) {
        return axios.delete(`${this.baseURL}category/delete/${id}`, { module });
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