import axios from "axios"

const httpAxios= axios.create({
    baseURL: 'https://zstore.click/api/'
    //timeout: 1000,
    //headers:{'X-Custom-Header':'foobar'}
});
httpAxios.interceptors.response.use(function(response){
    return response.data;
},function(error){
    return Promise.reject(error);
}
);
export default httpAxios;