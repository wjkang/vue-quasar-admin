import request from '@/libs/request'
import qs from 'qs'

export function getAccessMemu() {
    return request({
        url: '/menu/getaccessmenu',
        method: 'get',
        loading:"gears"
    })
}

export function getAllMenu(){
    return request({
        url: '/menu',
        method: 'get',
        loading:"gears"
    })
}

export function saveMenu(menu){
    return request({
        url: '/menu/savemenu',
        method: 'post',
        data:menu,
        loading:"hourglass",
        permission:["menu_edit"]
    })
}

export function getMenuFunctions(menuId){
    return request({
        url: '/menu/menufunctions',
        method: 'get',
        params:menuId,
        loading:"gears"
    })
}

export function getIcons(){
    return request({
        url: '/icons',
        method: 'get',
        loading:"gears"
    })
}