import axios from "../utils/axios";

export default class profile{
    static baseURL = 'user/';
    static details(data){
        return axios.post(this.baseURL + "profile/details", data);
    }

    static list(data) {
        return axios.get(this.baseURL + 'list', { params: data });
    }

    static save(data) {
        return axios.post(this.baseURL + "save", data);
    }

    static delete(id) {
        return axios.delete(`${this.baseURL}/delete/${id}`);
    }
    
}