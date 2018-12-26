import request from '@/utils/request'
import qs from 'qs'

// 获取bnner列表找借口
export function getBannerList(data) {
  return request({
    url: '/getBannerList',
    method: 'get',
  })
}

// 修改banner接口
export function bannerModify(data) {
  return request({
    url: '/bannerModify',
    method: 'post',
    data: qs.stringify(data)
  })
}
