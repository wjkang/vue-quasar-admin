import request from '@/libs/request'

export function getRolePagedList(query) {
    return request({
        url: '/role/pagedlist',
        method: 'get',
        params: query
    })
}

export function delRole(id) {
    return request({
        url: '/role/del',
        method: 'delete',
        params: id,
        loading:"hourglass"
    })
}

export function delRoles(ids) {
    return request({
        url: '/role/batchdel',
        method: 'delete',
        params:ids,
        loading:"hourglass"
    })
}

export function saveRole(data) {
    return request({
        url: '/role/save',
        method: 'post',
        data: data,
        loading:"hourglass"
    })
}

export function savePermission(data){
    return request({
        url: '/role/savepermission',
        method: 'post',
        data: data,
        loading:"hourglass"
    })
}
