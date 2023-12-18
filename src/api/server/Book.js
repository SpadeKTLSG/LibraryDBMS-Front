import request from '@/utils/request'

// 查询书籍列表
export function listBook(query) {
    return request({
        url: '/server/Book/list',
        method: 'get',
        params: query
    })
}

// 查询书籍详细
export function getBook(bookId) {
    return request({
        url: '/server/Book/' + bookId,
        method: 'get'
    })
}

// 新增书籍
export function addBook(data) {
    return request({
        url: '/server/Book',
        method: 'post',
        data: data
    })
}

// 修改书籍
export function updateBook(data) {
    return request({
        url: '/server/Book',
        method: 'put',
        data: data
    })
}

// 删除书籍
export function delBook(bookId) {
    return request({
        url: '/server/Book/' + bookId,
        method: 'delete'
    })
}
