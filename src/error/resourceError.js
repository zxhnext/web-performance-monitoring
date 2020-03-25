import Monitor from "../library/monitor.js"
import {
    ErrorCategoryEnum,
    ErrorLevelEnum
}
from "../library/config.js"
/**
 * 资源加载错误
 */
class ResourceError extends Monitor {

    constructor(params) {
        super(params);
    }

    /**
     * 注册onerror事件
     * 由于网络请求异常不会事件冒泡，因此必须在捕获阶段将其捕捉到才行。
     * 这种方式虽然可以捕捉到网络请求的异常，但是无法判断 HTTP 的状态是 404 还是其他比如 500 等等，所以还需要配合服务端日志才进行排查分析才可以。
     */
    handleError() {
        window.addEventListener('error', (event) => {
            try {
                if (!event) {
                    return;
                }
                this.category = ErrorCategoryEnum.RESOURCE_ERROR;
                let target = event.target || event.srcElement;
                var isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
                if (!isElementTarget) {
                    return; // js error不再处理
                }
                this.level = target.tagName.toUpperCase() === 'IMG' ? ErrorLevelEnum.WARN : ErrorLevelEnum.ERROR;
                this.msg = "加载 " + target.tagName + " 资源错误";
                this.url = target.src || target.href;
                this.errorObj = target;
                this.recordError();
            } catch (error) {
                console.log("资源加载收集异常", error);
            }
        }, true);
    }
}
export default ResourceError;