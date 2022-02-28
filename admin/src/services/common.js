import axios from "../utils/axios";

export default class common {

    constructor() {
        this.baseURL = 'common';
    }

    /* Input Types */

    static listInputTypes(data, module) {
        return axios.get(this.baseURL + '/input-types', { params: data, module });
    }
    static listInputTypesAll(module) {
        return axios.get(this.baseURL + "/input-types/all", { module });
    }
    static listEMIOptions(module) {
        return axios.get(this.baseURL + "/emi-options", { module });
    }
    static listEMIOptionsAll(module) {
        return axios.get(this.baseURL + "/emi-options/all", { module });
    }
}