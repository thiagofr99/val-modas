import axios from "axios";

const api = axios.create({
    //baseURL: 'http://168.138.133.220:8080',
    baseURL: 'http://localhost:8080',
});


export default api;