import {
    ErrorLevelEnum,
    ErrorCategoryEnum
} from './config.js'
import DeviceInfo from '../device'
import utils from './utils.js'
import TaskQueue from './taskQueue.js'

/**
 * 监控基类
 */

class Monitor {

    /**
     * 上报错误地址
     * @param {*} params { reportUrl,extendsInfo }
     */
    constructor(params, newCaptureClick) {
        this.reportUrl = params.reportUrl // 上报错误地址
        this.extendsInfo = params.extendsInfo // 扩展信息
        this.newCaptureClick = newCaptureClick
    }

    /**
     * 记录错误信息
     * @params 错误参数
     */
    recordError(params) {
        this.handleRecordError(params)
        //延迟记录日志
        setTimeout(() => {
            TaskQueue.fire()
        }, 100)
    }

    /**
     * 处理记录日志
     */
    handleRecordError(params) {
        try {
            if (!params.msg) {
                return
            }
            //过滤掉错误上报地址
            if (this.reportUrl && this.url && this.url.toLowerCase().indexOf(this.reportUrl.toLowerCase()) >= 0) {
                console.log('统计错误接口异常', params.msg)
                return
            }
            let errorInfo = this.handleErrorInfo(params)
            console.log('\n````````````````````` ' + params.category + ' `````````````````````\n', errorInfo)

            //记录日志
            TaskQueue.add(this.reportUrl, errorInfo)

        } catch (error) {
            console.log('添加日志记录失败：', error)
        }
    }

    /**
     * 处理错误信息
     * @param {*} extendsInfo 
     */
    handleErrorInfo(params) {
        let deviceInfo = this.getDeviceInfo()
        let extendsInfo = this.getExtendsInfo()
        let recordInfo = {
            getErrorId: utils.randomString(),
            url: params.url || location.href, // 错误信息地址
            category: params.category || null, // 错误分类
            logType: params.level || ErrorLevelEnum.INFO, // 错误级别
            msg: params.msg || null, // 错误信息
            deviceInfo: deviceInfo, // 设备信息 
            time: new Date().getTime() // 错误时间
        }
        Object.assign(recordInfo, extendsInfo)
        let txt = `错误类别: ${params.category}\r\n`
        txt += `日志信息: ${params.msg}\r\n`
        txt += `URL: ${params.url}\r\n`
        switch (params.category) {
            case ErrorCategoryEnum.JS_ERROR:
                recordInfo.name = params.name || null // 错误名
                recordInfo.type = params.type || null // js错误类型
                recordInfo.line = params.line || null // 行数
                recordInfo.col = params.col || null // 列数
                recordInfo.stack = params.stack || null // 错误堆栈
                txt += `错误行号: ${recordInfo.line}\r\n`
                txt += `错误列号: ${recordInfo.col}\r\n`
                if (recordInfo.stack) {
                    txt += `错误栈: ${recordInfo.stack}\r\n`
                }
                this.newCaptureClick.reportCaptureImage({
                    getErrorId: recordInfo.getErrorId, 
                    url: this.reportUrl
                })
                break
            case ErrorCategoryEnum.IFRAME_ERROR:
                recordInfo.name = params.name || null // 错误名
                recordInfo.type = params.type || null // js错误类型
                recordInfo.line = params.line || null // 行数
                recordInfo.col = params.col || null // 列数
                recordInfo.stack = params.stack || null // 错误堆栈
                txt += `错误行号: ${recordInfo.line}\r\n`
                txt += `错误列号: ${recordInfo.col}\r\n`
                if (recordInfo.stack) {
                    txt += `错误栈: ${recordInfo.stack}\r\n`
                }
                break  
            case ErrorCategoryEnum.AJAX_ERROR:
                recordInfo.request = params.request || {}
                recordInfo.response = params.response || {}
                recordInfo.responseTime = params.responseTime || null
                break
            case ErrorCategoryEnum.PROMISE_ERROR:
                recordInfo.resourceUrl = params.resourceUrl || null
                recordInfo.line = params.line || null
                recordInfo.col = params.col || null
                recordInfo.responseTime = params.responseTime || null
                break
            case ErrorCategoryEnum.RESOURCE_ERROR:
                recordInfo.resourceUrl = params.resourceUrl || null
                break
            case ErrorCategoryEnum.VUE_ERROR:
                recordInfo.vueInfo = params.vueInfo || null
                recordInfo.name = params.name || null// 错误名
                recordInfo.resourceUrl = params.resourceUrl || null
                recordInfo.vueComponentName = params.vueComponentName || null
                recordInfo.vuePropsData = params.vuePropsData || null
                recordInfo.line = params.line || null // 行数
                recordInfo.col = params.col || null // 列数
                recordInfo.stack = params.stack || null // 错误堆栈
                txt += `错误行号: ${recordInfo.line}\r\n`
                txt += `错误列号: ${recordInfo.col}\r\n`
                if (params.stack) {
                    txt += `错误栈: ${recordInfo.stack}\r\n`
                }
                break
            default:
                if(params.errorObj && !utils.objectIsNull(params.errorObj)) {
                    txt += `其他错误: ${JSON.stringify(params.errorObj)}\r\n`
                }
                break
        }
        txt += `设备信息: ${deviceInfo}` // 设备信息 
        recordInfo.logInfo = txt // 错误信息详细
        return recordInfo
    }

    /**
     * 获取扩展信息
     */
    getExtendsInfo() {
        try {
            let ret = {}
            let extendsInfo = this.extendsInfo || {}
            let dynamicParams
            if (utils.isFunction(extendsInfo.getDynamic)) {
                dynamicParams = extendsInfo.getDynamic() // 获取动态参数
            }
            // 判断动态方法返回的参数是否是对象
            if (utils.isObject(dynamicParams)) {
                extendsInfo = {
                    ...extendsInfo,
                    ...dynamicParams
                }
            }
            // 遍历扩展信息，排除动态方法
            for (var key in extendsInfo) {
                if (!utils.isFunction(extendsInfo[key])) { // 排除获取动态方法
                    ret[key] = extendsInfo[key]
                }
            }
            return ret
        } catch (error) {
            console.log('获取扩展信息失败：', error)
            return {}
        }
    }

    /**
     * 获取设备信息
     */
    getDeviceInfo() {
        try {
            let deviceInfo = DeviceInfo.getDeviceInfo()
            return JSON.stringify(deviceInfo)
        } catch (error) {
            console.log(error)
            return ''
        }
    }

}
export default Monitor