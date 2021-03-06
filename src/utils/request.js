import { Message } from 'element-ui'
import axios from 'axios'
import store from '../store'
import { baseUrl } from '../config'

// create an axios instance
const baseConfig = {
  baseURL: baseUrl, // api的base_url
  withCredentials: true,
  timeout: 5000, // 请求超时时间
}

const service = axios.create(baseConfig)

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['Authorization'] = `Bearer ${store.getters.token}` // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(response => {
  console.log(response.status)
  if(response.data.code !== 0) {
    console.log('进入相应拦截器错误处理了')
    Message.error(response.data.msg);
  }
  return response
}, error => {
  switch(error.response.status) {
    case 401:
      // 登录过期，清除token
      sessionStorage.removeItem('JASON_BLOG_TOKEN');
      store.commit('SET_TOKEN','');
      location.reload();
      break;
  }
  console.log('err' + error) // for debug
  return Promise.reject(error)
})

export default service
