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
