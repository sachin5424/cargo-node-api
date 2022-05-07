import axios from "../utils/axios";

export default class driver {
    static baseURL = 'driver/';

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
        return axios.delete(`${this.baseURL}/delete/${id}`, { module });
    }

    static listWalletHistory(data, module) {
        return axios.get(this.baseURL + 'list/wallet-history', { params: data, module });
    }

    static listAllWalletHistory(data, module) {
        return axios.get(this.baseURL + 'list/wallet-history/ALL', { params: data, module });
    }

    static saveWalletHistory(data, module) {
        return axios.post(this.baseURL + "save/wallet-history", data, { module });
    }

    static listLogins(data, module) {
        return axios.get(this.baseURL + 'logins/list', { params: data, module });
    }

    static listLoginsAll(data, module) {
        return axios.get(this.baseURL + 'logins/list/ALL', { params: data, module });
    }

    static listOnOff(data, module) {
        return axios.get(this.baseURL + 'on-off/list', { params: data, module });
    }

    static listOnOffAll(data, module) {
        return axios.get(this.baseURL + 'on-off/list/ALL', { params: data, module });
    }

}