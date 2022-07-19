import axios from "axios";

const api = axios.create({
    baseURL: 'http://192.168.40.156:8080',
});

export default api;