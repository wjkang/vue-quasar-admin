import * as authService from '@/libs/auth'
import * as loginService from '@/service/login'

const user = {
    state: {
        token: authService.getToken(),
        userInfo: {
            name: '',
            avatar: ''
        }
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
        },
        SET_USERINFO(state, userInfo) {
            state.userInfo = userInfo
        }
    },
    actions: {
        //用户名登录
        LoginByUserName({ commit }, userinfo) {
            const username = userinfo.username.trim()
            return new Promise((resolve, reject) => {
                loginService.loginByUsername(username, userinfo.password).then(response => {
                    const data = response.data.data
                    commit('SET_TOKEN', data.accessToken)
                    authService.setToken(data.accessToken)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({ commit }, state) {
            return new Promise((resolve, reject) => {
                loginService.logout().then((response) => {
                    commit('SET_TOKEN', '')
                    commit('SET_USERINFO', {
                        name: '',
                        avatar: ''
                    })
                    authService.removeToken()
                    resolve()
                }).catch(error => {
                    commit('SET_TOKEN', '')
                    commit('SET_USERINFO', {
                        name: '',
                        avatar: ''
                    })
                    authService.removeToken()
                    reject(error)
                })
            })
        },
        GetUserInfo({ commit }, state) {
            return new Promise((resolve, reject) => {
                loginService.getUserInfo().then((response) => {
                    const data = response.data.data
                    const userInfo = {
                        name: data.userName,
                        avatar: data.avatarUrl
                    }
                    commit('SET_USERINFO', userInfo)
                    let userRole = data.userRole
                    let userPermission = data.userPermission
                    let permission = [...userRole, ...userPermission]
                    let isAdmin = data.isAdmin
                    localStorage.setItem("permission", JSON.stringify(permission))
                    localStorage.setItem("isAdmin", isAdmin)
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
};

export default user;
