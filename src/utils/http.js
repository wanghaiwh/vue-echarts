import axios from 'axios';
import router from '../router/index';
import Cookies from "js-cookie";
// axios 配置
axios.defaults.timeout = 8000;
// axios.defaults.baseURL = 'http://172.16.70.201:8086';
 
// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (Cookies.get("token")) { //判断token是否存在
      config.headers.token = Cookies.get("token");  //将token设置成请求头
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
 
// http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.status === 400) {
      Cookies.remove('token')
      router.replace('/login');
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);
export default axios;