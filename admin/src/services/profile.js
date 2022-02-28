import axios from "../utils/axios";

export default class profile{
    static details(data){
        return axios.post("profile/details", data);
    }
    static save(data) {
        return axios.post("profile/save", data);
    }
}