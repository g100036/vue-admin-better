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

// 用户积分提取
export function userPointExtract(data) {
  return request({
    url: `/points/extract?userName=${data.userName}&points=${data.points}`,
    method: 'post',
  })
}
// 查询所有下级用户
export function getInviteUserList(data) {
  return request({
    url: '/account/queryuserinviteuser',
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

// 查询用户变动记录
export function getUserPointsRecord(data) {
  return request({
    url: '/points/userpointsrecord',
    method: 'post',
    data,
  })
}
// 根据用户编号查询用户变动记录
export function getUserPointsRecordByUserName(data) {
  return request({
    url: '/points/querypoints',
    method: 'post',
    data,
  })
}

// 新增用户积分
export function addUserPoints(data) {
  return request({
    url: '/points/addpoints',
    method: 'post',
    data,
  })
}

// 查询用户提现记录
export function getUserPointsGetRecord(data) {
  return request({
    url: '/api/getUserWithdrawRecords',
    method: 'post',
    data
  })
}

// 更新用户提现记录状态
export function updateUserPointsGetRecordStatus(data) {
  return request({
    url: '/api/setUserWithdrawRecordsStatus',
    method: 'post',
    data,
  })
}