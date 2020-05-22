import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
// import errorCode from './errorCode'
import { replaceApi } from 'utils/replaceRestFullApi'
import { isEmptyObj } from 'utils/utils'
import { Notice } from 'view-design'

axios.defaults.timeout = 8000
// axios.defaults.headers['Accept-Language'] = (navigator.language || navigator.browserLanguage)
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    return config
}, function (error) {
    return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // console.log(response)
    // response.data.status sdk 接口
    if (response.status === 200 && (response.data.errorCode === 0 || response.data.code === '0' || response.data.code === 0 || response.data.status === 0)) {
        if (response.data.code === 0) {
            return response.data.result
        }

        return response.data.data
    } else {
        let errTip = response.data.errorMsg || response.data.msg || response.data.message
        Notice.error({
            title: errTip
        })

        if (process.env.NODE_ENV === 'development') {
            return Promise.reject(response)
        }

        return Promise.reject(errTip)
    }
}, function (error) {
    return Promise.reject(error)
})

function restFull (config) {
    if (!config.url) {
        Notice.error({
            title: '没有输入 URL'
        })
        return
    }
    let params = {
        method: 'get',
        url: ''
    }
    let mergeConfig = Object.assign({}, params, config)

    if (!isEmptyObj(mergeConfig.jointData)) {
        mergeConfig.url = replaceApi(mergeConfig.url, mergeConfig.jointData)
        delete mergeConfig.jointData
    }
    /*  if (mergeConfig.method.toUpperCase() === 'GET') {
        mergeConfig.params = mergeConfig.data
    } else if (mergeConfig.method.toUpperCase() === 'POST') {
        mergeConfig.data = qs.stringify(mergeConfig.data)
    } */

    // if (isEmptyObj(mergeConfig.data)) {
    //     delete mergeConfig.data
    // }
    if (mergeConfig.method.toUpperCase() === 'POST') {
        mergeConfig.data = qs.stringify(mergeConfig.data)
    }

    if (process.env.NODE_ENV === 'development') {
        // console.log(mergeConfig)
    }

    return axios(mergeConfig)
}

Vue.prototype.$axios = axios
Vue.prototype.$restFull = restFull
axios.restFull = restFull
export default axios
