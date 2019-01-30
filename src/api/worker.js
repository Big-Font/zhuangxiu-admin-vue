import request from '@/utils/request'
import qs from 'qs'

// 获取装修案例列表接口
export function getFindWorkerList(data) {
  return request({
    url: '/getFindWorkerList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 找师傅状态更改
export function handleWorkerType(data) {
  return request({
    url: '/handleWorkerType',
    method: 'post',
    data: qs.stringify(data)
  })
}
