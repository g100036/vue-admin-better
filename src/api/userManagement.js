import request from '@/utils/request'

// 获取用户列表
export function getList(data) {
  return request({
    url: '/account/queryuser',
    method: 'post',
    data,
  })
}
// 获取总积分列表
export function getUserPointTotal(data) {
  return request({
    url: '/points/queryuserpoints',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/userManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/userManagement/doDelete',
    method: 'post',
    data,
  })
}
