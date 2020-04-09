// https://github.com/Jameszws/monitorjs_horse

import { monitorPerformance, measure  } from './performance'
import { AjaxLibEnum } from './utils/config.js'
import CaptureClick from './utils/captureClick.js'
import utils from './utils/utils.js'
import { AjaxError, ConsoleError, JsError, PromiseError, ResourceError, VueError, FrameError } from './error'

let monitorJS = {
    /**
     * 监听页面性能
     * @param {*} options {pageId：页面标示, url：上报地址, isPage：是否上报页面性能数据, isResource：是否上报页面资源数据}
     */
    monitorPerformance,

    measure,

    init(options) {
        options = options || {}
        let jsError = options.jsError || true
        let frameError = options.frameError || true
        let promiseError = options.promiseError || true
        let resourceError = options.resourceError || true
        let ajaxError = options.ajaxError || true
        let consoleError = options.consoleError || false
        let vueError = options.vueError || false
        let reportUrl = options.url || null // 上报错误地址
        let extendsInfo = options.extendsInfo || {}  //扩展信息（一般用于系统个性化分析）
        let param = { reportUrl, extendsInfo }

        let capture = {
            captureClick: true,
            captureMode: 2,
            captureReportNum: 10
        }
        if(options.capture && utils.isString(options.capture)) {
            capture.captureClick = options.capture
        } else if(options.capture) {
            capture = options.capture
        }
        let newCaptureClick = new CaptureClick(capture)
        newCaptureClick.initCaptureClick()

        if(jsError) {
            new JsError(param, newCaptureClick).handleError()
        }
        if(frameError) {
            new FrameError(param).handleError()
        }
        if(promiseError) {
            new PromiseError(param).handleError()
        }
        if(resourceError) {
            new ResourceError(param).handleError()
        }
        if(ajaxError) {
            new AjaxError(param).handleError(AjaxLibEnum.DEFAULT)
        }
        if(consoleError) {
            new ConsoleError(param).handleError()
        }
        if(vueError && options.vue) {
            new VueError(param).handleError(options.vue)
        }
    }
}

window.monitorJS = monitorJS

export default monitorJS