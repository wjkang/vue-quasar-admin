import request from '@/libs/request'

export function resetDb() {
    return request({
        url: '/resetdb',
        method: 'post',
        loading:"hourglass"
    })
}