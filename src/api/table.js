import request from '@/utils/request'

// 查询所有卡密
export function getList(data) {
  return request({
    url: '/account/queryuserkey',
    method: 'post',
    data,
  })
}
export function doEdit(data) {
  return request({
    url: '/table/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/table/doDelete',
    method: 'post',
    data,
  })
}

//  新增卡密
export function addKeys(data) {
  return request({
    url: '/account/registerkey',
    method: 'post',
    data,
  })
}

// 查询卡密购买记录
export function getBuyCardsRecord(data) {
  return request({
    url: '/api/getBuyCardsRecord',
    method: 'post',
    data,
  })
}

// 新增卡密购买记录
export function addBuyCardsRecord(data) {
  return request({
    url: '/api/addBuyCardsRecord',
    method: 'post',
    data,
  })
}

// 保存购买的卡号列表
export function setCardsList(data) {
  return request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    url: '/api/setCardsList',
    method: 'post',
    data,
  })
}

// 设置系统信息
export function setSystemSetting(data) {
  return request({
    url: '/api/setSystemSetting',
    method: 'post',
    data,
  })
}