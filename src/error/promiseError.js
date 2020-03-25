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
                this.level = ErrorLevelEnum.WARN;
                this.category = ErrorCategoryEnum.PROMISE_ERROR;
                this.msg = event.reason;
                this.recordError();
            } catch (error) {
                console.log(error);
            }
        }, true);
    }
}
export default PromiseError;