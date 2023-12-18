import request from '@/utils/request'
import axios from "axios";
import {__esModule as typeOptions} from "vue-cropper/dist/vue-cropper.umd.js";

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

// 修改部分：添加了一个 getTypeOptions 方法，用来发送 axios 请求到后端接口，获取类型列表，并赋值给 typeOptions 数组
// export function getTypeOptions() {
//     axios.get('/api/server/Book/getTypeOptions').then(response => {
//         typeOptions.value = response.data;
//     });
//     return typeOptions;
// }

// 查询书籍类型列表
export function getTypeOptions() {
    return request({
        url: '/server/Book/getTypeOptions',
        method: 'get'
    })
}
