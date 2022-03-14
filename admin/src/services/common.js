import axios from "../utils/axios";

export default class common {
    static baseURL = 'common';

    static listServiceType() {
        return axios.get(this.baseURL + '/list-service-type', { module: 'ignoreModule' });
    }
}