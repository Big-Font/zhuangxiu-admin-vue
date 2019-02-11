import request from '@/utils/request'
import qs from 'qs'

// 获取装修案例列表接口
export function caseList(data) {
  return request({
    url: '/caseList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 发布装修案例接口
export function fitupCasePublic(data) {
  return request({
    url: '/fitupCasePublic',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改装修案例接口
export function fitupcaseModify(data) {
  return request({
    url: '/fitupcaseModify',
    method: 'post',
    data: qs.stringify(data)
  })
}
