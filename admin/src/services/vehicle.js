import axios from "../utils/axios";

export default class vehicle {
    static baseURL = 'vehicle/';

    static listMake(data, module) {
        return axios.get(this.baseURL + 'make/list', { params: data, module });
    }
    static listAllMake(data, module) {
        return axios.get(this.baseURL + 'make/list/ALL', { params: data, module });
    }
    static saveMake(data, module) {
        return axios.post(this.baseURL + "make/save", data, { module });
    }
    static deleteMake(id, module) {
        return axios.delete(`${this.baseURL}make/delete/${id}`, { module });
    }

    static listMakeModel(data, module) {
        return axios.get(this.baseURL + 'make-model/list', { params: data, module });
    }
    static listAllMakeModel(data, module) {
        return axios.get(this.baseURL + 'make-model/list/ALL', { params: data, module });
    }
    static saveMakeModel(data, module) {
        return axios.post(this.baseURL + "make-model/save", data, { module });
    }
    static deleteMakeModel(id, module) {
        return axios.delete(`${this.baseURL}make-model/delete/${id}`, { module });
    }

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