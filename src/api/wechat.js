import request from '@/utils/request'
import qs from 'qs'

// 所有消息策略
export function getALLReply(data) {
  return request({
    url: '/getALLReply',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 添加微信回复策略
export function publicWechatReply(data) {
  return request({
    url: '/publicWechatReply',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改和删除微信回复策略
export function modifyWechatReply(data) {
  return request({
    url: '/modifyWechatReply',
    method: 'post',
    data: qs.stringify(data)
  })
}
