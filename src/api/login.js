import request from '@/utils/request'
import qs from 'qs'

// 急速借款列表  --- 获取产品大类  /v1/product/queryLoanType
export function postApi(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function login(username, password, capkey) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      username,
      password,
      capkey
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
