import request from '@/libs/request'

export function getUserList() {
  return request({
    url: '/user/userlist',
    method: 'get'
  })
}
export function getUserPagedList(query) {
  return request({
    url: '/user/pagedlist',
    method: 'get',
    params: query
  })
}

export function delUser(id) {
  return request({
      url: '/user/del',
      method: 'delete',
      params: id,
      loading:"hourglass"
  })
}

export function delUsers(ids) {
  return request({
      url: '/user/batchdel',
      method: 'delete',
      params:ids,
      loading:"hourglass"
  })
}

export function saveUser(data) {
  return request({
      url: '/user/save',
      method: 'post',
      data: data,
      loading:"hourglass"
  })
}

export function editRoleUser(data){
  return request({
      url: '/user/editroleuser',
      method: 'post',
      data: data,
      loading:"hourglass"
  })
}