import axios from "axios";

const api_cep = axios.create({
    //baseURL: 'http://168.138.133.220:8080',
    baseURL: 'https://viacep.com.br/ws/',
});


export default api_cep;