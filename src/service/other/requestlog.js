import request from '@/libs/request'

export function getRequestLogPagedList(query) {
    return request({
        url: '/requestlog/pagedlist',
        method: 'get',
        params: query
    })
}