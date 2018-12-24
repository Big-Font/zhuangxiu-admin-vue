import request from '@/utils/request'
import qs from 'qs'

// 添加文章接口
export function articlePublishApi(data) {
  return request({
    url: '/admin/articlePublish',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function articleListApi(data) {
  return request({
    url: '/admin/articleList',
    method: 'get',
    data: qs.stringify(data)
  })
}

export function articleApi(data) {
  return request({
    url: '/admin/article',
    method: 'post',
    data: qs.stringify(data)
  })
}
