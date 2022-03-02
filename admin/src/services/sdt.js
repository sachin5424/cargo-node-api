import axios from "../utils/axios";

export default class sdt {
    static baseURL = 'sdt';

    static listSdt() {
        return axios.get(this.baseURL + '/sdt');
    }
}