import request from '@/utils/request'

export function getNoticeList() {
  return request({
    url: '/announcement/queryannouncement',
    method: 'post',
  })
}

export function deleteNotice(data) {
  return request({
    url: '/announcement/delannouncement',
    method: 'post',
    data: data,
  })
}

export function addNotice(data) {
  return request({
    url: '/announcement/addannouncement',
    method: 'post',
    data: data,
  })
}
