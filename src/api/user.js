import request from '@/utils/request'
import qs from 'qs'

// m站用户列表
export function mUserList(data) {
  return request({
    url: '/mUserList',
    method: 'post',
    data: qs.stringify(data)
  })
}
