import request from '@/utils/request'

// 查询员工列表
export function listStaff(query) {
    return request({
        url: '/server/Staff/list',
        method: 'get',
        params: query
    })
}

// 查询员工详细
export function getStaff(staffId) {
    return request({
        url: '/server/Staff/' + staffId,
        method: 'get'
    })
}

// 新增员工
export function addStaff(data) {
    return request({
        url: '/server/Staff',
        method: 'post',
        data: data
    })
}

// 修改员工
export function updateStaff(data) {
    return request({
        url: '/server/Staff',
        method: 'put',
        data: data
    })
}

// 删除员工
export function delStaff(staffId) {
    return request({
        url: '/server/Staff/' + staffId,
        method: 'delete'
    })
}
