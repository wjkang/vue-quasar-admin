import request from '@/libs/request'

export function getPostPagedList(query) {
    return request({
        url: '/post/pagedlist',
        method: 'get',
        params: query
    })
}

export function getPost(id) {
    return request({
        url: '/post/' + id,
        method: 'get',
        loading: "hourglass"
    })
}

export function savePost(post) {
    return request({
        url: '/post/save',
        method: 'post',
        data: post,
        loading: "hourglass"
    })
}

export function getTopPostByQuery(query) {
    return request({
        url: '/post/top',
        method: 'get',
        params: query,
        loading: "gears"
    })
}