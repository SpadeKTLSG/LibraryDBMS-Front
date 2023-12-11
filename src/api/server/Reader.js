import request from '@/utils/request'

// 查询读者列表
export function listReader(query) {
  return request({
    url: '/server/Reader/list',
    method: 'get',
    params: query
  })
}

// 查询读者详细
export function getReader(cardNumber) {
  return request({
    url: '/server/Reader/' + cardNumber,
    method: 'get'
  })
}

// 新增读者
export function addReader(data) {
  return request({
    url: '/server/Reader',
    method: 'post',
    data: data
  })
}

// 修改读者
export function updateReader(data) {
  return request({
    url: '/server/Reader',
    method: 'put',
    data: data
  })
}

// 删除读者
export function delReader(cardNumber) {
  return request({
    url: '/server/Reader/' + cardNumber,
    method: 'delete'
  })
}
