import request from '@/utils/request'

// 查询书架列表
export function listBookshelf(query) {
  return request({
    url: '/server/Bookshelf/list',
    method: 'get',
    params: query
  })
}

// 查询书架详细
export function getBookshelf(bookshelfNumber) {
  return request({
    url: '/server/Bookshelf/' + bookshelfNumber,
    method: 'get'
  })
}

// 新增书架
export function addBookshelf(data) {
  return request({
    url: '/server/Bookshelf',
    method: 'post',
    data: data
  })
}

// 修改书架
export function updateBookshelf(data) {
  return request({
    url: '/server/Bookshelf',
    method: 'put',
    data: data
  })
}

// 删除书架
export function delBookshelf(bookshelfNumber) {
  return request({
    url: '/server/Bookshelf/' + bookshelfNumber,
    method: 'delete'
  })
}
