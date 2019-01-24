import request from '@/utils/fontRequest'
import qs from 'qs'

// 秒杀活动列表
export function registerAPI(data) {
  return request({
    url: '/register',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 登录
export function loginAPI(data) {
  return request({
    url: '/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 发布找师傅接口
export function addWorkerAPI(data) {
  return request({
    url: '/addWorkerMsg',
    method: 'post',
    data: qs.stringify(data)
  })
}
