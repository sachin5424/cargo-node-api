import axios from "../utils/axios";

export default class auth{
    static login(data){
        return axios.post("user/login", data);
    }
    static validateToken(data){
        return axios.post("user/validate-token", data);
    }
}