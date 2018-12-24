import axios from 'axios'
import store from '../store'
import { baseUrl } from '../config'

// create an axios instance
const baseConfig = {
  baseURL: baseUrl, // api的base_url
  withCredentials: true,
  timeout: 5000 // 请求超时时间
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
  return response
}, error => {
  console.log('err' + error) // for debug
  return Promise.reject(error)
})

export default service
