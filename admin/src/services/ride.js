import axios from "../utils/axios";

export default class ride {
    static baseURL = 'ride/';

    static listRideType(data, module) {
        return axios.get(this.baseURL + 'type/list', { params: data, module });
    }
    static listAllRideType(data, module) {
        return axios.get(this.baseURL + 'type/list/ALL', { params: data, module });
    }
    static saveRideType(data, module) {
        return axios.post(this.baseURL + "type/save", data, { module });
    }
    // static deleteRideType(id, module) {
    //     return axios.delete(`${this.baseURL}type/delete/${id}`, { module });
    // }

}