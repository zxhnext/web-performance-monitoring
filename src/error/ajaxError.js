import Monitor from "../library/monitor.js";
import {
    ErrorCategoryEnum,
    AjaxLibEnum,
    ErrorLevelEnum
} from "../library/config.js";
import utils from "../library/utils";

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
            case AjaxLibEnum.FETCH:
                new FetchError(this.params).handleError(err);
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
        if (!window.axios) return;
        const _axios = window.axios
        const List = ['axios', 'request', 'get', 'delete', 'head', 'options', 'put', 'post', 'patch']
        List.forEach(item => {
            _reseat(item)
        })

        function _reseat(item) {
            let _key = null;
            if (item === 'axios') {
                window['axios'] = resetFn;
                _key = _axios
            } else if (item === 'request') {
                window['axios']['request'] = resetFn;
                _key = _axios['request'];
            } else {
                window['axios'][item] = resetFn;
                _key = _axios[item];
            }

            function resetFn() {
                const result = ajaxArg(arguments, item)
                if (result.report !== 'report-data') {
                    const url = result.url ? result.url.split('?')[0] : '';
                }
                return _key.apply(this, arguments)
                    .then(function (res) {
                        if (result.report === 'report-data') return res;
                        try {
                            if (res.status !== 200) {
                                this.recordError();
                            }
                        } catch (e) { }
                        return res
                    })
                    .catch((err) => {
                        if (result.report === 'report-data') return res;
                        
                        // statusText: err.message,
                        // method: result.method,
                        // responseURL: result.url,
                        // options: result.options,
                        // status: err.response ? err.response.status : 0,
                        
                        this.recordError();
                        return err
                    })
            }
        }

        // Ajax arguments
        function ajaxArg(arg, item) {
            let result = { method: 'GET', type: 'xmlhttprequest', report: '' }
            let args = Array.prototype.slice.apply(arg)
            try {
                if (item == 'axios' || item == 'request') {
                    result.url = args[0].url
                    result.method = args[0].method
                    result.options = result.method.toLowerCase() == 'get' ? args[0].params : args[0].data
                } else {
                    result.url = args[0]
                    result.method = ''
                    if (args[1]) {
                        if (args[1].params) {
                            result.method = 'GET'
                            result.options = args[1].params;
                        } else {
                            result.method = 'POST'
                            result.options = args[1];
                        }
                    }
                }
                result.report = args[0].report
            } catch (err) { }
            return result;
        }
    }

    // handleError(error) {
    //     if (error && error.config && error.config.url) {
    //         this.url = error.config.url;
    //     }
    //     this.level = ErrorLevelEnum.WARN;
    //     this.category = ErrorCategoryEnum.AJAX_ERROR;
    //     this.msg = JSON.stringify(error);
    //     this.recordError();
    // }
}

class FetchError extends Monitor {

    constructor(params) {
        super(params);
    }

    handleError(error) {
        if(!window.fetch) return;
        let _oldFetch = window.fetch;
        window.fetch = function () {
            this.level = ErrorLevelEnum.WARN;
            this.category = ErrorCategoryEnum.AJAX_ERROR;
            let args = Array.prototype.slice.apply(arg);
            if (!args || !args.length) return result;
            if (args.length === 1) {
                if (typeof args[0] === 'string') {
                    this.url = args[0];
                } else if (utils.isObject(args[0])) {
                    this.url = args[0].url;
                    this.method = args[0].method;
                }
            } else {
                this.url = args[0];
                this.method = args[1].method;
                this.type = args[1].type;
            }
            this.url = arguments[0]
            this.metaData = arguments[1]
            return _oldFetch.apply(this, arguments)
            .then(res => {
                if (res.status !== 200) { // True if status is HTTP 2xx
                    // 上报错误
                    this.responseData = res.data
                    this.recordError();
                }
                return res;
            })
            .catch(error => {
                // 上报错误
                this.error = error.message
                this.stack = error.stack
                this.recordError();
                throw error;  
            })
        }
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
        // 保存原生的 open 方法
        let xhrOpen = XMLHttpRequest.prototype.open;
        // 保存原生的 send 方法
        let xhrSend = XMLHttpRequest.prototype.send;
        let reqMethod;
        let _handleEvent = (event, arg) => {
            try {
                if (event && event.currentTarget && event.currentTarget.status !== 200) {
                    this.level = ErrorLevelEnum.WARN;
                    this.category = ErrorCategoryEnum.AJAX_ERROR;
                    this.msg = event.target.response;
                    this.url = event.target.responseURL;
                    this.method = reqMethod;
                    this.data = arg[0] || {};
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
        // 重写 open
        XMLHttpRequest.prototype.open = function() {
            // 先在此处取得请求的method
            reqMethod = arguments[0];
            // 再调用原生 open 实现重写
            return xhrOpen.apply(this, arguments);
        };
        // 重写 send
        XMLHttpRequest.prototype.send = function () {
            let arg = arguments;
            if (this.addEventListener) {
                this.addEventListener('error', (e) => _handleEvent(e, arg)); // 失败
                this.addEventListener('load', (e) => _handleEvent(e, arg)); // 完成
                this.addEventListener('abort', (e) => _handleEvent(e, arg)); // 取消
            } else {
                let tempStateChange = this.onreadystatechange;
                this.onreadystatechange = function (event) {
                    tempStateChange.apply(this, arguments);
                    if (this.readyState === 4) {
                        _handleEvent(event, arg);
                    }
                }
            }
            // 再调用原生 send 实现重写
            return xhrSend.apply(this, arguments);
        }
    }

}