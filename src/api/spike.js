import request from '@/utils/request'
import qs from 'qs'

// 秒杀活动列表
export function spikeActiveList(data) {
  return request({
    url: '/spikeActiveList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 秒杀活动详情
export function querySpikeDetail(data) {
  return request({
    url: '/querySpikeDetail',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 发布秒杀活动
export function spikeActivePublish(data) {
  return request({
    url: '/spikeActivePublish',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改秒杀活动
export function modifySpikeActive(data) {
  return request({
    url: '/modifySpikeActive',
    method: 'post',
    data: qs.stringify(data)
  })
}
