import Monitor from "../library/monitor.js";
import {
    ErrorCategoryEnum,
    AjaxLibEnum,
    ErrorLevelEnum
} from "../library/config.js";

/**
 * ajax error异常
 */
class AjaxError {
    constructor(params) {
        this.params = params;
    }
    /**
     * 处理错误
     * @param type {*} ajax库类型
     * @param error{*} 错误信息
     */
    handleError(type, err) {
        switch (type) {
            case AjaxLibEnum.AXIOS:
                new AxiosError(this.params).handleError(err);
                break;
            default:
                new XHRError(this.params).handleError();
                break;
        }
    }
}

export default AjaxError;

/**
 * Axios类库 错误信息处理(如果不配置，可以统一通过XHR接受错误信息)
 */
class AxiosError extends Monitor {

    constructor(params) {
        super(params);
    }

    handleError(error) {
        if (error && error.config && error.config.url) {
            this.url = error.config.url;
        }
        this.level = ErrorLevelEnum.WARN;
        this.category = ErrorCategoryEnum.AJAX_ERROR;
        this.msg = JSON.stringify(error);
        this.recordError();
    }
}

/**
 * 获取HTTP错误信息
 */
class XHRError extends Monitor {

    constructor(params) {
        super(params);
    }

    /**
     * 获取错误信息
     */
    handleError() {
        if (!window.XMLHttpRequest) {
            return;
        }
        let xhrSend = XMLHttpRequest.prototype.send;
        let _handleEvent = (event) => {
            try {
                if (event && event.currentTarget && event.currentTarget.status !== 200) {
                    this.level = ErrorLevelEnum.WARN;
                    this.category = ErrorCategoryEnum.AJAX_ERROR;
                    this.msg = event.target.response;
                    this.url = event.target.responseURL;
                    this.errorObj = {
                        status: event.target.status,
                        statusText: event.target.statusText
                    };
                    this.recordError();
                }
            } catch (error) {
                console.log(error);
            }
        };
        XMLHttpRequest.prototype.send = function () {
            if (this.addEventListener) {
                this.addEventListener('error', _handleEvent); // 失败
                this.addEventListener('load', _handleEvent); // 完成
                this.addEventListener('abort', _handleEvent); // 取消
            } else {
                let tempStateChange = this.onreadystatechange;
                this.onreadystatechange = function (event) {
                    tempStateChange.apply(this, arguments);
                    if (this.readyState === 4) {
                        _handleEvent(event);
                    }
                }
            }
            return xhrSend.apply(this, arguments);
        }
    }

}