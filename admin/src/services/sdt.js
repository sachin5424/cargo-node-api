import axios from "../utils/axios";

export default class sdt {
    static baseURL = 'sdt/';

    static listSdt(module) {
        return axios.get(this.baseURL + 'sdt', { module });
    }

    static listState(data, module="viewState") {
        return axios.get(this.baseURL + 'state/list', { params: data, module });
    }
    static listAllState(data, module="viewState") {
        return axios.get(this.baseURL + 'state/list/ALL', { params: data, module });
    }
    static saveState(data, module) {
        return axios.post(this.baseURL + "state/save", data, { module });
    }
    static deleteState(id, module) {
        return axios.delete(`${this.baseURL}/state/delete/${id}`, { module });
    }

    static listDistrict(data, module="viewDistrict") {
        return axios.get(this.baseURL + 'district/list', { params: data, module });
    }
    static listAllDistrict(data, module="viewDistrict") {
        return axios.get(this.baseURL + 'district/list/ALL', { params: data, module });
    }
    static saveDistrict(data, module) {
        return axios.post(this.baseURL + "district/save", data, { module });
    }
    static deleteDistrict(id, module) {
        return axios.delete(`${this.baseURL}/district/delete/${id}`, { module });
    }

    static listTaluk(data, module="viewTaluk") {
        return axios.get(this.baseURL + 'taluk/list', { params: data, module });
    }
    static listAllTaluk(data, module="viewTaluk") {
        return axios.get(this.baseURL + 'taluk/list/ALL', { params: data, module });
    }
    static saveTaluk(data, module) {
        return axios.post(this.baseURL + "taluk/save", data, { module });
    }
    static deleteTaluk(id, module) {
        return axios.delete(`${this.baseURL}/taluk/delete/${id}`, { module });
    }
}