import request from '@/libs/request'
import qs from 'qs'

export function getMenuListFunctionCode() {
    return request({
        url: '/function/menulistfunctioncode',
        method: 'get',
        loading:"gears"
    })
}

export function getFunctionPagedList(query) {
    return request({
        url: '/function/pagedlist',
        method: 'get',
        params: query
    })
}

export function delFunction(id) {
    return request({
        url: '/function/del',
        method: 'delete',
        params: id,
        loading:"hourglass"
    })
}

export function delFunctions(ids) {
    return request({
        url: '/function/batchdel',
        method: 'delete',
        params:ids,
        loading:"hourglass"
    })
}

export function saveFunction(data) {
    return request({
        url: '/function/save',
        method: 'post',
        data: data,
        loading:'hourglass'
    })
}