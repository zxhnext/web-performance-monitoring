import Monitor from "../library/monitor.js";
import {
    ErrorCategoryEnum,
    ErrorLevelEnum
} from "../library/config.js"
/**
 * 捕获未处理的Promise异常
 */
class PromiseError extends Monitor {

    constructor(params) {
        super(params);
    }

    /**
     * 处理错误
     */
    handleError() {
        window.addEventListener('unhandledrejection', (event) => {
            try {
                if (!event || !event.reason) {
                    return;
                }
                //判断当前被捕获的异常url，是否是异常处理url，防止死循环
                if (event.reason.config && event.reason.config.url) {
                    this.url = event.reason.config.url;
                }
                const error = e && e.reason
                const stack = error.stack || '';
                this.message = error.message || '';
                // Processing error
                let resourceUrl, col, line;
                let errs = stack.match(/\(.+?\)/)
                if (errs && errs.length) errs = errs[0]
                errs = errs.replace(/\w.+[js|html]/g, $1 => { resourceUrl = $1; return ''; })
                errs = errs.split(':')
                if (errs && errs.length > 1) line = parseInt(errs[1] || 0);
                col = parseInt(errs[2] || 0)
                this.t = new Date().getTime();
                this.data = {
                    resourceUrl,
                    line,
                    col
                };
                this.level = ErrorLevelEnum.WARN;
                this.category = ErrorCategoryEnum.PROMISE_ERROR;
                this.msg = event.reason;
                this.responseTime = event.timeStamp; // 响应时间
                this.pageUrl = event.target.document.URL
                this.recordError();
            } catch (error) {
                console.log(error);
            }
        }, true);
    }
}
export default PromiseError;