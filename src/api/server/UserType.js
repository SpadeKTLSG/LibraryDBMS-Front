import request from '@/utils/request'

// 查询用户类型列表
export function listUserType(query) {
  return request({
    url: '/server/UserType/list',
    method: 'get',
    params: query
  })
}

// 查询用户类型详细
export function getUserType(userType) {
  return request({
    url: '/server/UserType/' + userType,
    method: 'get'
  })
}

// 新增用户类型
export function addUserType(data) {
  return request({
    url: '/server/UserType',
    method: 'post',
    data: data
  })
}

// 修改用户类型
export function updateUserType(data) {
  return request({
    url: '/server/UserType',
    method: 'put',
    data: data
  })
}

// 删除用户类型
export function delUserType(userType) {
  return request({
    url: '/server/UserType/' + userType,
    method: 'delete'
  })
}
