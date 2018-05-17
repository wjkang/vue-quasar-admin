import axios from 'axios'
import { Router } from '@/router/index';
import { getToken, removeToken } from '@/libs/auth'
import loading from '@/libs/loading'
import permission from '@/libs/permission'
import { Notify } from 'quasar'

// create an axios instance
const service = axios.create({
  baseURL: process.env.API, // api的base_url
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (!permission.check(config)) {
    Notify.create({
      message: "没有请求权限"
    })
    throw "403"
  }
  loading.show(config)
  let token = getToken()
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token// 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  //console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    loading.hide(response.config)
    const res = response.data;
    if (res.statusCode !== 200) {
      Notify.create({
        message: res.msg
      })
      return Promise.reject('error');
    } else {

      return response;
    }
  },
  error => {
    loading.hide(error.config)
    if (error.response && error.response.status === 401) {
      removeToken();
      if (error.config.url.indexOf("logout") === -1) {
        Notify.create({
          message: '登陆信息已过期,请重新登陆!'
        })
      }
      setTimeout(() => {
        router.push({
          name: "login"
        });
      }, 1000)

    } else if (error.response && error.response.status === 500) {
      Notify.create({
        message: '系统错误!',
        position: 'bottom-right'
      })
    } else if (error.message == "timeout of 5000ms exceeded") {
      Notify.create({
        message: '网络超时!',
        position: 'bottom-right'
      })
    }
    else if (error == "403") {

    } else {
      Notify.create({
        message: '网络错误!',
        position: 'bottom-right'
      })
    }
    return Promise.reject(error)

  })

export default service



