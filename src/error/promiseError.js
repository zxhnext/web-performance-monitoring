import Monitor from '../utils/monitor.js'
import {
    ErrorCategoryEnum,
    ErrorLevelEnum
} from '../utils/config.js'
/**
 * 捕获未处理的Promise异常
 */
class PromiseError {

    constructor(params) {
        this.params = params
    }

    /**
     * 处理错误
     */
    handleError() {
        let data = {}
        window.addEventListener('unhandledrejection', event => {
            try {
                if (!event || !event.reason) {
                    return
                }
                //判断当前被捕获的异常url，是否是异常处理url，防止死循环
                if (event.reason.config && event.reason.config.url) {
                    data.url = event.reason.config.url
                }
                const error = event && event.reason
                const stack = error.stack || ''
                // Processing error
                let resourceUrl
                let errs = stack.match(/\(.+?\)/)
                if (errs && errs.length) {
                    errs = errs[0]
                    errs = errs.replace(/\w.+[js|html]/g, $1 => { data.resourceUrl = $1; return ''; })
                    errs = errs.split(':')
                    if (errs.length > 1) {
                        data.line = parseInt(errs[1] || null)
                        data.col = parseInt(errs[2] || null)
                    }
                }
                data.level = ErrorLevelEnum.WARN
                data.category = ErrorCategoryEnum.PROMISE_ERROR
                data.msg = event.reason.message || event.reason
                data.responseTime = event.timeStamp // 响应时间
                data.url = event.target.document.URL
                new Monitor(this.params).recordError(data)
            } catch (error) {
                console.log('Promise错误监控', error)
            }
            return true
        })
    }
}
export default PromiseError