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

// 添加商品分类
export function publicCategory(data) {
  return request({
    url: '/publicCategory',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 删除商品分类
export function deleteCategory(data) {
  return request({
    url: '/deleteCategory',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改商品分类名称
export function modeifyCategory(data) {
  return request({
    url: '/modeifyCategory',
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

// 商品列表中品牌、商家、类别查询接口--用于商品信息修改和发布
export function goodsInfoUpdateList(data) {
  return request({
    url: '/goodsInfoUpdateList',
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

// 发布品牌信息
export function publicBrandInfo(data) {
  return request({
    url: '/publicBrandInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改品牌信息 modeifyBrandInfo
export function modeifyBrandInfo(data) {
  return request({
    url: '/modeifyBrandInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 查询所有商家（不分页） getSellersListNoPage
export function getSellersListNoPage(data) {
  return request({
    url: '/getSellersListNoPage',
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

// 添加商家信息
export function publicSellerInfo(data) {
  return request({
    url: '/publicSellerInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 商家信息修改
export function modeifySellerInfo(data) {
  return request({
    url: '/modeifySellerInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}
