import { getTiming, getEntries, clearPerformance } from './performance.js'
import DeviceInfo from '../device'
import ttiPolyfill from 'tti-polyfill'
import API from '../http/api.js'

/**
 * 生成随机数
 */
const randomString = (len) => {
　　len = len || 10
　　const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789'
　　const maxPos = $chars.length
　　let pwd = ''
　　for (let i = 0; i < len; i++) {
　　　　pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos))
　　}
　　return pwd + new Date().getTime()
}

/**
 * 获得markpage
 */
const markUser = () => {
    let psMarkUser = sessionStorage.getItem('ps_markUser')||''
    if(!psMarkUser) {
        psMarkUser = randomString()
        sessionStorage.setItem('ps_markUser', psMarkUser)
    }
    return psMarkUser
}

/**
 * 获得Uv
 */
const markUv = () => {
    const date = new Date()
    let psMarkUv = localStorage.getItem('ps_markUv') || ''
    const dataTime = localStorage.getItem('ps_markUvTime') || ''
    const today = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} 23:59:59`
    if( (!psMarkUv && !dataTime) || (date.getTime() > dataTime*1) ) {
        psMarkUv = randomString()
        localStorage.setItem('ps_markUv', psMarkUv)
        localStorage.setItem('ps_markUvTime', new Date(today).getTime())
    }
    return psMarkUv
}

export default function monitorPerformance(options) {
    ttiPolyfill.getFirstConsistentlyInteractive().then((tti) => {
        let isPage = options.isPage || true // 是否上报页面性能数据
        let isResource = options.isResource || true // 是否上报页面资源数据
        let config = {
            resourceList:[], // 资源列表
            performance:{}, // 页面性能列表
        }
        if(isPage) {
            config.performance = getTiming()
        }
        if(isResource) {
            config.resourceList = getEntries()
        }
        let params = {
            time: new Date().getTime(),
            performance: Object.assign(config.performance, {tti}),
            resourceList: config.resourceList,
            markUser: markUser(),
            markUv: markUv(),
            pageId: options.pageId || '',
            deviceInfo: DeviceInfo.getDeviceInfo()
        }
        console.log('report data =', params)
        // 发送监控数据
        new API(options.url).report(params)
        clearPerformance()
    })
}