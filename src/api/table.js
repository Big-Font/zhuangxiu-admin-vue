import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/admin/articleList',
    method: 'get',
    params
  })
}
