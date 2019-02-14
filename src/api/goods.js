import request from '@/utils/request'
import qs from 'qs'

// 商品分类接口
export function categoryList(data) {
  return request({
    url: '/categoryList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 商品管理列表查询
export function getGoods(data) {
  return request({
    url: '/getGoods',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取商品品牌列表
export function getBrandList(data) {
  return request({
    url: '/getBrandList',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取商家列表
export function getSellersList(data) {
  return request({
    url: '/getSellersList',
    method: 'post',
    data: qs.stringify(data)
  })
}
