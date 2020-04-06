import { getTiming, getEntries, clearPerformance, measure } from './performance.js'
import DeviceInfo from '../device'
import ttiPolyfill from 'tti-polyfill'
import API from '../http/api.js'
import utils from '../utils/utils.js'

function monitorPerformance(options) {
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
            markUser: utils.markUser(),
            markUv: utils.markUv(),
            pageId: options.pageId || '',
            deviceInfo: DeviceInfo.getDeviceInfo()
        }
        console.log('report data =', params)
        // 发送监控数据
        new API(options.url).report(params)
        clearPerformance()
    })
}

export { monitorPerformance, measure }