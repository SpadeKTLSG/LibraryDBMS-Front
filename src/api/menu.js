import request from '@/utils/request'

// 获取路由, 用于动态加载菜单
export const getRouters = () => {
    return request({
        url: '/getRouters',
        method: 'get'
    })
}
