import request from '@/utils/request'

// 查询借阅列表
export function listBorrow(query) {
    return request({
        url: '/server/Borrow/list',
        method: 'get',
        params: query
    })
}

// 查询借阅详细
export function getBorrow(cardNumber) {
    return request({
        url: '/server/Borrow/' + cardNumber,
        method: 'get'
    })
}

// 新增借阅
export function addBorrow(data) {
    return request({
        url: '/server/Borrow',
        method: 'post',
        data: data
    })
}

// 修改借阅
export function updateBorrow(data) {
    return request({
        url: '/server/Borrow',
        method: 'put',
        data: data
    })
}

// 删除借阅
export function delBorrow(cardNumber) {
    return request({
        url: '/server/Borrow/' + cardNumber,
        method: 'delete'
    })
}

//! 查询对应读者的借阅列表
export function listReaderBorrow(query) {
    return request({
        url: '/server/Borrow/listReader',
        method: 'get',
        params: query
    })
}
